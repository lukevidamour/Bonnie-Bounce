/* encode.swift — makes the trailer video from what tools/reel/ filmed:
   out/frames/, PNGs of the game's 512x288 canvas, 60 a second, and
   out/audio.wav, into a 1920x1080 H.264 + AAC MP4 for sharing.

   Apple's own frameworks only, so nothing to install (ffmpeg would do
   the same, but isn't on every Mac):
     swiftc -O -swift-version 5 tools/reel/encode.swift -o /tmp/reel-encode
     /tmp/reel-encode tools/reel/out ~/Desktop/bonnie-bounce.mp4

   Each frame is first blown up to a whole multiple with no smoothing,
   so every pixel stays a sharp square, then scaled to 1080p smoothly:
   no wobbly half-pixel columns, no blur. */
import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: reel-encode <out dir> <video.mp4>"); exit(1) }
let dir = URL(fileURLWithPath: args[1]), dest = URL(fileURLWithPath: args[2])
let W = 1920, H = 1080, FPS: Int32 = 60
let names = try FileManager.default.contentsOfDirectory(atPath: dir.appendingPathComponent("frames").path)
  .filter { $0.hasSuffix(".png") && $0.count == 9 }.sorted()
guard !names.isEmpty else { print("no frames in \(dir.path)/frames"); exit(1) }

// ---- the picture -------------------------------------------------------------
let silent = dest.deletingLastPathComponent().appendingPathComponent(".reel-picture.mp4")
try? FileManager.default.removeItem(at: silent)
let writer = try AVAssetWriter(outputURL: silent, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [
    // pixel art is all hard edges: generous, so they stay clean after LinkedIn re-encodes it
    AVVideoAverageBitRateKey: 16_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: 60
  ],
  AVVideoColorPropertiesKey: [
    AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
    AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
    AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2
  ]
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
let space = CGColorSpace(name: CGColorSpace.sRGB)!
let info = CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue

for (i, name) in names.enumerated() {
  autoreleasepool {
    let url = dir.appendingPathComponent("frames").appendingPathComponent(name)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("can't read \(name)") }
    let k = Int((Double(H) / Double(img.height)).rounded(.up)) + 1
    let big = CGContext(data: nil, width: img.width * k, height: img.height * k, bitsPerComponent: 8, bytesPerRow: 0, space: space, bitmapInfo: info)!
    big.interpolationQuality = .none
    big.draw(img, in: CGRect(x: 0, y: 0, width: img.width * k, height: img.height * k))
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
    CVPixelBufferLockBaseAddress(pb!, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: space, bitmapInfo: info)!
    ctx.interpolationQuality = .high
    ctx.draw(big.makeImage()!, in: CGRect(x: 0, y: 0, width: W, height: H))
    CVPixelBufferUnlockBaseAddress(pb!, [])
    while !input.isReadyForMoreMediaData { usleep(1000) }
    adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: FPS))
  }
}
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { print("picture failed: \(String(describing: writer.error))"); exit(1) }

// ---- the sound: the WAV to AAC (afconvert, built in), then both into one file ----
let wav = dir.appendingPathComponent("audio.wav")
try? FileManager.default.removeItem(at: dest)
if FileManager.default.fileExists(atPath: wav.path) {
  let aac = dest.deletingLastPathComponent().appendingPathComponent(".reel-sound.m4a")
  try? FileManager.default.removeItem(at: aac)
  let conv = Process()
  conv.executableURL = URL(fileURLWithPath: "/usr/bin/afconvert")
  conv.arguments = ["-f", "m4af", "-d", "aac", "-b", "256000", wav.path, aac.path]
  try conv.run(); conv.waitUntilExit()
  let mix = AVMutableComposition()
  let pic = AVURLAsset(url: silent), snd = AVURLAsset(url: aac)
  let length = pic.duration
  let vt = mix.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
  try vt.insertTimeRange(CMTimeRange(start: .zero, duration: length), of: pic.tracks(withMediaType: .video)[0], at: .zero)
  let at = mix.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
  try at.insertTimeRange(CMTimeRange(start: .zero, duration: CMTimeMinimum(length, snd.duration)), of: snd.tracks(withMediaType: .audio)[0], at: .zero)
  let export = AVAssetExportSession(asset: mix, presetName: AVAssetExportPresetPassthrough)!
  export.outputURL = dest
  export.outputFileType = .mp4
  export.exportAsynchronously { done.signal() }
  done.wait()
  guard export.status == .completed else { print("joining failed: \(String(describing: export.error))"); exit(1) }
  try? FileManager.default.removeItem(at: aac)
  try? FileManager.default.removeItem(at: silent)
} else {
  try FileManager.default.moveItem(at: silent, to: dest)
}
print("\(names.count) frames → \(dest.path)")
