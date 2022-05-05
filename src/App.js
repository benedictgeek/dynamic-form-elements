import React, { useMemo } from "react";

import "./App.css";
import { useApp } from "./useApp";

function App() {
  const {
    questions,
    formRef,
    handleChange,
    handleFileUpload,
    onSubmit,
    isUploadingImage,
    isSubmitting,
    isFetching,
  } = useApp();

  const formInputs = useMemo(() => {
    let inputElements = [];

    questions.forEach((question) => {
      let element;
      switch (question.type) {
        case "number":
        case "date":
        case "text":
          element = (
            <div key={question.id}>
              {/* The title of an input was null so i default to description */}
              <label htmlFor={question.id}>
                {question.title || question.description}
              </label>
              <input
                name={question.id}
                type={question.type}
                defaultValue=""
                placeholder={question.description}
                onChange={(e) => handleChange(e, question)}
                required
              />
            </div>
          );
          break;
        case "image":
        case "video":
          element = (
            <div key={question.id}>
              <label htmlFor={question.id}>{question.description}</label>
              <input
                type="file"
                defaultValue=""
                name={question.id}
                accept={`${question.type}/*`}
                onChange={(e) => handleFileUpload(e, question)}
                required
              />
            </div>
          );

          break;
        default:
          break;
      }

      if (element) {
        inputElements.push(element);
      }
    });

    return inputElements;
  }, [questions]);

  return (
    <div className="appContainer">
      <header className="header">Dynamic Inputs Project</header>
      {isFetching && <div>Loading form, please wait...</div>}
      <form onSubmit={onSubmit} ref={formRef}>
        {formInputs}

        {formInputs.length > 0 && (
          <input
            type={"submit"}
            value={
              isUploadingImage
                ? "Uploading file..."
                : isSubmitting
                ? "Submitting..."
                : "Submit answers"
            }
          />
        )}
      </form>
    </div>
  );
}

export default App;
