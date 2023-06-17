import axios from 'axios';

const baseApi = 'http://192.168.1.144:5003';

export const save =
  (
    activeDrawing, setSavingState, setMenuOpen = undefined,
    canvas, setTriggerSave, closeMenu = undefined, savingRef = undefined
  ) => {
    const apiSavePath = `${baseApi}/save-drawing`;

    if (activeDrawing.name === '' || activeDrawing.name === 'Drawing title') {
      alert('Need a name');
      return;
    }

    setSavingState('saving');

    axios.post(apiSavePath, {
      name: activeDrawing.name,
      topics: activeDrawing.tags,
      drawing: canvas.toDataURL()
    }).then((res) => {
      if (res.status === 200) {
        if (savingRef) savingRef.current = false;
        setSavingState('saved');
        if (setMenuOpen) setMenuOpen(false);
        if (closeMenu) closeMenu();
        setTriggerSave(false);
      } else {
        alert('Failed to save');
      }
    });
  };

export const search = (searchTerm, tags, setSearchResults) => {
  const apiSearchPath = `${baseApi}/search-drawing`;

  setSearchResults([]);

  axios.post(apiSearchPath, {
    name: searchTerm,
    topics: tags
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.drawings.length) {
        setSearchResults(res.data.drawings);
      }
    } else {
      alert('Failed to search');
    }
  });
};

export const loadDrawing = (drawing, canvas, setMenuOpen, setSearchTerm, setTags, erase, setActiveDrawing, closeMenu) => {
  const apiGetDrawingPath = `${baseApi}/get-drawing`;

  console.log('load', drawing);

  axios.post(apiGetDrawingPath, {
    id: drawing.id
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.length) {
        // https://stackoverflow.com/a/4409745
        erase();

        let image = new Image();
    
        image.onload = function() {
          canvas.getContext("2d").drawImage(image, 0, 0);
        };

        image.src = res.data[0].drawing;
        setActiveDrawing(drawing);
        closeMenu(setMenuOpen, setSearchTerm, setTags);
      }
    } else {
      alert('Failed to load drawing');
    }
  });
};
