# The title for the blog eg. fixing bugs for cross platform app

The implementation of this thing will be basic for now eg. I will not address images. Already I can see problems, like "how do you handle check boxes".

This is interesting, I keep thinking in React Native now I'm like "where is the `FlatList`" while working in just React.

## Desktop bugs/features

- [x] fix issue of create note crashing if you also type into the body
    - yeah this one seems pretty bad, the issue is when you're in the create state(blue create btn appears in search) and you type into the body, it crashes due to `onChange` handler of body
    - fixes/changes
        - added null event if in create mode(shows create button)
        - set body text to empty after creating new note
- [x] feature but desired, delete
    - show icon/delete on click/delete method in API
    - tried to add extra credit, disable cursor, doesn't seem to work on re-render, but does disable row clicks
- [x] add option to create entry even if there are results when the searched item doesn't match any results