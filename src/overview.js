function fillOverview(tableData) {
    nbOfQuestions = tableData.filter((row) => row["annotationType"] === "question").length;
    document.getElementById("total-questions").innerText = nbOfQuestions;

    nbOfComments = tableData.filter((row) => row["annotationType"] === "comment").length;
    document.getElementById("total-comments").innerText = nbOfComments;

    nbOfDefects = tableData.filter((row) => row["annotationType"] === "defect").length;
    document.getElementById("total-defects").innerText = nbOfDefects;

    nbOfThesauri = tableData.filter((row) => row["annotationType"] === "thesaurus").length;
    document.getElementById("total-thesauri").innerText = nbOfThesauri;

    nbOfOthers = tableData.filter((row) => row["annotationType"] === "other").length;
    document.getElementById("total-others").innerText = nbOfOthers;

    nbOfDistinctAuthors = [...new Set(tableData.map((row) => row["author"]))].length;
    document.getElementById("total-authors").innerText = nbOfDistinctAuthors;

    mostActiveAuthor = tableData.reduce((acc, row) => {
        acc[row["author"]] = (acc[row["author"]] || 0) + 1;
        return acc;
    }, {});
    mostActiveAuthor = Object.keys(mostActiveAuthor).reduce((a, b) => mostActiveAuthor[a] > mostActiveAuthor[b] ? a : b);
    document.getElementById("most-active-author").innerText = mostActiveAuthor;

    nbOfDistinctWebpages = [...new Set(tableData.map((row) => row["pageUrl"]))].length;
    document.getElementById("total-webpages").innerText = nbOfDistinctWebpages;

    mostAnnotatedWebpage = tableData.reduce((acc, row) => {
        acc[row["pageUrl"]] = (acc[row["pageUrl"]] || 0) + 1;
        return acc;
    }, {});
    mostAnnotatedWebpage = Object.keys(mostAnnotatedWebpage).reduce((a, b) => mostAnnotatedWebpage[a] > mostAnnotatedWebpage[b] ? a : b);
    document.getElementById("most-annotated-webpage").innerText = mostAnnotatedWebpage;
}