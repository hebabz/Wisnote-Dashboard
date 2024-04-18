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
      const { _id, objectType, objectValue, objectDescription, __v } =
        obj;
      return {
        _id,
        objectType,
        objectValue,
        objectDescription,
        __v,
      };
    });
    return {
      _id,
      pageUrl,
      author, // /authors to find the name
      connectionType,
      annotationType,
      item: formattedItem,
      body,
      createdAt,
      updatedAt
    };
  });
  return formattedAnnotations;
}
