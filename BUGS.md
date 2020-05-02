### Desktop
- bugs
    - [ ] creating a note if you fill in textarea it will crash due to auto-update
        - options
            - [ ] disable/create name first
            - [ ] flex textarea behavior to not do XHR request on non-existent data (harder)
    - [ ] when creating a new note, empty the active body eg. old app data shows
    - [ ] weird bug where you type fast enough in search seems like an empty search goes through, all results appear
- add
    - [ ] when searching, if partial search string doesn't match results, show create button
    - [ ] delete, red x on results like mobile

### React Native
- bugs
    - [ ] issue with search(select result) wrong selected name shown in search
- add
    - [ ] when searching, if partial search string doesn't match results, show create button
    - [ ] delete event
- user experience
    - [ ] fix the focusing problems
    - [ ] fix the focus loss when API updates

### Shared API
- add
    - [ ] validation, can actually break server if some fields empty eg. `column null`
    - [ ] delete method(select by name, delete all rows)