import React, { useEffect, useState, createRef } from "react";

const POOL_ID = 7;
const USER_ID = "62444d9c448a8a001cba5109";
const BASE_URL = "https://staging-api.mizala.xyz/pools/v1/";
const requestHeaders = {
  "Content-Type": "application/json",
};
export const useApp = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isUploadingImage, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const formRef = createRef();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(BASE_URL + "pool/questions/7", {
        method: "get",
        headers: requestHeaders,
      });

      const data = await response.json();
      if (!data.success) {
        throw data;
      }
      setQuestions(data.data);
      setIsFetching(false);
    } catch (error) {
      alert("Could not fetch questions. Please reload the page");
    }
  };

  const handleChange = async (e, question) => {
    e.preventDefault();
    updateAnswers({
      ...question,
      value: e.target?.value,
      name: e.target?.name,
    });
  };

  const handleFileUpload = async (e, question) => {
    try {
      e.preventDefault();
      setIsUploading(true);
      const formData = new FormData();

      formData.append("file", e.target?.files[0]);
      formData.append("upload_preset", "th0bxrxg");
      formData.append("cloud_name", "db1p64grm");
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/db1p64grm/${question.type}/upload`,
        {
          method: "post",
          body: formData,
        }
      );
      const fileData = await resp.json();
      updateAnswers({
        ...question,
        value: fileData.url,
        name: e.target?.name,
      });
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
    }
  };

  const updateAnswers = (payload) => {
    setAnswers((prevAnswers) => {
      return {
        ...prevAnswers,
        [payload.name]: {
          pool_id: POOL_ID,
          question_id: payload.id,
          type: payload.type,
          member_id: USER_ID,
          answer: payload.value,
        },
      };
    });
  };

  const onSubmit = async (e) => {
    try {
      if (isUploadingImage) return;
      e.preventDefault();
      setIsSubmitting(true);
      const response = await fetch(BASE_URL + "pool/answers", {
        method: "POST",
        headers: requestHeaders,

        body: JSON.stringify({
          answers: Object.values(answers),
          user_id: USER_ID,
          pool_id: POOL_ID,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw data;
      }
      formRef.current.reset();
      setIsSubmitting(false);
      alert("Answers submitted successfully");
    } catch (error) {
      setIsSubmitting(false);
      alert("Could not submit answers, please try again");
    }
  };

  return {
    questions,
    formRef,
    handleChange,
    handleFileUpload,
    onSubmit,
    isUploadingImage,
    isSubmitting,
    isFetching
  };
};
