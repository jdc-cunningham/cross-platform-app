Desires

- [x] drawing app (06/15/2023)
    - got this great [starter code](https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse) here, figured out how to make it with my drawing tablet, this will be embedded for basic drawings
    - it'll be interesting figuring out how to save data
    - possible to save to image, looking into keeping drawing

06/15/2023

Desires lol

Yeah I'm going to add the drawing app that I made it's over here separate repo

https://github.com/jdc-cunningham/drawing-notes-app

It's a piece of crap but works, has pressure support

6:22 PM

dang it... dealing with node-sass on win 10 right now, this branch need to remove

also thinking about app vs. web... specifically full screen for when in tablet mode/folded over

6:29 PM

oh no this one has an offset problem

well now is the time...

oh dang, when you load an image, have to clear existing canvas first

6:39 PM

nice fixed the offset

I gotta rebuild this for my SG 4K chromebook

6:51 PM

cool it's working

<img src="./sgc-4k.JPG"/>

Can see pressure working, this is a desktop app made for Linux (Manjaro Arch)

6:53 PM

oh damn I forgot about the automatic saving

need to add that

7:17 PM

I'm obsessing over the first dot/pixel being the default color wth....

7:24 PM

I'm gonna have to move the API calls outside... in order to call them from the drawing ahh... kuso

7:59 PM

I'm stuck... have a weird situation where I need to trigger a method in the child from the parent

Do it with props but it doesn't always run

8:30 PM

oh dang the save API does not overwrite existing data, just appends oops

8:40 PM

need to fix the API real quick and then pull in these changes...

I really should make this an npm package or something vs. making changes in two places... or a git submodule maybe
