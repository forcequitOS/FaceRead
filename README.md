# Watch Face Inspector (/FaceRead/FaceEdit)
### A simple tool to gather data about Apple Watch Face (.watchface) files
*This is currently a public beta and is incomplete. Even when it is complete, don't rely on this for anything, not that you would anyways.*

**What does this do?**
It's simple.
- Extract any given .watchface file as a .zip (as that's all .watchface files are, I'll make a writeup on that someday.)
- Parse information from face.json to gather the bundle ID and analytics ID
- Parse information from metadata.json to gather the complication layout and naming

**What doesn't this do?**
A lot.
- Provide a way to edit watch faces (currently) or visually preview them
- Provide the actual marketing names for watch faces (This is a matter of time and effort, though.)
- Allow you to view photos from a Photos or Portraits watch face (for now)
- Provide color previews of watch faces

*All of these features are being worked on*, just not actively.

**So why does this exist?**
A few reasons.
- This provides a way to view some information about .watchface files if you don't own an Apple device in an easy, human-readable way
- This provides a way to view informaton about .watchface files beyond a preview image on a Mac or iPad
- I wanted an example project to showcase some of the cool stuff hidden in these files to make others more interested
- I got bored.

Enjoy. Don't redistribute without my permission or something. Use this as the basis for your other projects, I don't care.
