### Desktop
- bugs
    - [ ] fix multi entry issue(every keystroke makes a save request due to timeout being improperly implemented)
    - [x] creating a note if you fill in textarea it will crash due to auto-update
        - options
            - [ ] disable/create name first
            - [ ] flex textarea behavior to not do XHR request on non-existent data (harder)
            - [x] change text output behavior to show text/ignore `onChange`
    - [x] when creating a new note, empty the active body eg. old app data shows
    - [ ] weird bug where you type fast enough in search seems like an empty search goes through, all results appear
- add
    - [x] when searching, if partial search string doesn't match results, show create button
    - [x] delete, red x on results like mobile

### React Native
- bug
    - [x] issue with search(select result) wrong selected name shown in search
- add
    - [x] when searching, if partial search string doesn't match results, show create button
    - [x] delete event
- user experience
    - [x] fix the focusing problems
    - [x] fix the focus loss when API updates

### Shared API
- add
    - [ ] validation, can actually break server if some fields empty eg. `column null`
    - [x] delete method(select by name, delete all rows)