import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { FormField, Loader, FormFieldDiary } from "../components";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * @typedef {Object} FormData
 * @property {string} name - The user's name
 * @property {string} prompt - The prompt text
 * @property {string} photo - The photo URL
 */

const CreatePost = () => {
  const navigate = useNavigate();

  /**
   * @type {[FormData, React.Dispatch<React.SetStateAction<FormData>>]}
   */
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateImage = async () => {
    const aiPrompt = form.prompt.trim();
    if (aiPrompt) {
      try {
        console.log("Sending prompt:", aiPrompt); // 요청 데이터 디버깅
        setGeneratingImg(true);
        const response = await fetch(
          `${process.env.REACT_APP_HOSTING}/api/v1/dalle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: aiPrompt,
            }),
          }
        );

        const data = await response.json();
        console.log("Response data:", data); // 서버 응답 디버깅
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        console.error(err);
        alert(err.message || "An error occurred.");
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HOSTING}/api/v1/post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...form }),
          }
        );

        await response.json();
        alert("Success");
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Write Diary
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px]">
          DALL-E AI로 나의 아바타에게 감정을 기록해주고, 그에 맞는 오늘의
          이미지를 생성해보세요!
        </p>
      </div>

      <form className="mt-8 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Today's Date"
            type="text"
            name="name"
            placeholder="오늘의 날짜를 적어주세요 (Ex: 2024/07/07)"
            value={form.name}
            handleChange={handleChange}
          />

          <FormFieldDiary
            labelName="Today's Diary"
            type="text"
            name="prompt"
            placeholder="오늘은 아침 9시에 눈이떠졌다. 아침 일찍 집을 나섰는데 날씨가 너무 맑아서 기분이 좋았다 !
12시에 수업끝나구 마라탕을 먹으러갔는데, 마라탕에서 벌레가 나와 깜짝!@!!놀랬다.
원래 기분 좋았는데.. 마라탕 속 벌레때문에 기분이 안좋아졌다.
그래도 꿔바로우가 맛있어서 기분 풀기로했다 !"
            value={form.prompt}
            handleChange={handleChange}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-72 p-3 h-72 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-[#969696] hover:bg-[#E95C42] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** 원하는 이미지가 생성되었다면, 다이어리에 오늘의 이미지를
            저장해주세요! **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#C5D887] hover:bg-[#FFD66C] font-semibold rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Saving..." : "Save to Diary"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
