![Header](https://raw.githubusercontent.com/forcequitOS/FaceRead/main/thumbnail.png)
## A simple tool to gather data about and modify Apple Watch Face (.watchface) files.
Available today at https://watchface.pages.dev!

*This is currently a public beta and is incomplete. Even when it is complete, it won't be 100% problem-free, use it with a grain of salt that it won't be exactly what the Watch app is.*

**What does this do?** It's simple.
- Extract any given .watchface file as a .zip (as that's all .watchface files are, I'll make a writeup on that someday.)
- Parse information from face.json to gather the bundle ID and analytics ID
- Parse information from metadata.json to gather the complication layout and naming
- Match a list of analytics IDs to marketing names (which I've gathered myself)
- Gathers the already bundled snapshot image from the watch face file to display to the user

**What doesn't this do?** A lot.
- Provide the names of select watch faces (Most are there, but please contribute to [faceDB](https://gist.github.com/forcequitOS/f8d7e006f80a2c78e378f093608667fa) if you have an Apple Watch Hèrmes by sending your exclusive .watchface files to me in the gist comments!)
- Provide super accurate information for every watch face (I try, however some things will naturally be missed and many watch faces don't use human readable color, style, detail, etc. names internally)
- Allow you to view individual photos from a Photos, Legacy Photos, or Portraits watch face (for now)

These features *are being worked on* to the best of my ability currently.

**So why does this exist?** A few reasons.
- This provides a way to view some information about .watchface files if you don't own an Apple device in an easy, human-readable way
- This provides a way to view informaton about .watchface files beyond a small thumbnail image on a Mac or iPad
- I wanted an example project to showcase some of the cool stuff hidden in these files to make others more interested
- This shows some more internal information about these faces, like their specific identifiers (which would require manual extraction to find otherwise)
- I got bored.

Enjoy. Don't redistribute without my permission or something. Use this as the basis for your other projects, I don't care.
