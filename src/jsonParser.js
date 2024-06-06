annotations = null;

function dataToJson(data) {
  annotations = JSON.parse(data);

  //hide loading screen and show error screen if data is not in correct format
  if (!annotations.hasOwnProperty("annotations")) {
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#loading > *").style.display = "none";
    document.querySelector("#error").style.display = "block";
    document.querySelector("#error-message").innerHTML =
      "Error: Data is not in correct format";
    document.querySelector("#upload").disabled = false;
    return;
  }

  const formattedAnnotations = annotations.annotations.map((annotation) => {
    // retrieval of an annotation object
    const {
      _id,
      pageUrl,
      author,
      connectionType,
      annotationType,
      item,
      body,
      createdAt,
      updatedAt,
    } = annotation;
    // creating our own format for the annotation object
    const formattedItem = item.map((obj) => {
      const { objectPath, objectDescription, objectValue, objectType } = obj;
      const formattedObj = {
        objectDescription: objectDescription ?? objectPath.objectDescription,
        objectValue,
        objectType,
      };
      if (objectPath) {
        formattedObj.objectPosition = objectPath.objectPosition;
      }
      return formattedObj;
    });

    return {
      _id,
      pageUrl,
      author,
      connectionType,
      annotationType,
      item: formattedItem,
      body,
      createdAt,
      updatedAt,
    };
  });
  return formattedAnnotations;
}
