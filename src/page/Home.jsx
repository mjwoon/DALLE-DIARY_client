import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as dotenv from "dotenv";
import { Card, FormField, Loader } from "../components";

dotenv.config();

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = ({ userInfo, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOSTING}/api/v1/post`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [userInfo, navigate]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase()) ||
              item.prompt.toLowerCase().includes(searchText.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-[#222328] text-[32px]">
            My Diary
          </h1>
          <p className="mt-2 text-[#666e75] text-[14px]">
            DALL-E AI로 생성된 나의 아바타를 하루하루 일기장과 함께 감정을
            기록해보세요
          </p>
        </div>
        <Link
          to="/create-post"
          className="font-inter font-medium bg-[#C5D887] hover:bg-[#FFD66C] shadow-md text-white px-4 py-2 rounded-md hover:shadow-inner  "
        >
          Write Diary
        </Link>
      </div>

      <div className="mt-8">
        <FormField
          labelName="Search diary by date"
          type="text"
          name="text"
          placeholder="날짜로 일기를 검색해보세요...(Ex: 2024/07/07)"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Results for{" "}
                <span className="text-[#222328]">{searchText}</span>:
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search Results Found"
                />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
