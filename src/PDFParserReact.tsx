import pdfToText from "react-pdftotext";

function PDFParserReact({
  setParsedTextFromPdf,
}: {
  setParsedTextFromPdf: React.Dispatch<React.SetStateAction<string>>;
}) {
  function extractText(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null) {
      const file = event?.target?.files[0];
      pdfToText(file)
        .then((text) => setParsedTextFromPdf(text))
        .catch((error) =>
          console.error("Failed to extract text from pdf", error)
        );
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => extractText(event)}
        />
      </header>
    </div>
  );
}
export default PDFParserReact;
