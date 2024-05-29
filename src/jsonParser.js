annotations = null;

function dataToJson(data) {
  annotations = JSON.parse(data);

  const formattedAnnotations = annotations.annotations.map((annotation) => {
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
    const formattedItem = item.map((obj) => {
      const { objectPath, objectDescription, objectValue, objectType } = obj;
      const formattedObj = {
        objectDescription: objectDescription ?? objectPath.objectDescription,
        objectValue,
        objectType,
      };
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
