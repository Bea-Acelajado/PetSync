import { useEffect, useState } from "react";
import { loadCollection, saveDocument } from "../../petsyncData";

const categories = ["All Discussions", "Care Tips", "Training", "Stories"];
const posts = [
  {
    author: "Sarah H.",
    pet: "Cooper",
    time: "2 hours ago",
    category: "Stories",
    text: "Cooper finally mastered the high five today. It took a lot of treats and patience, but that wagging tail made it worth it.",
    image: "/assets/about-us/dog.jpg",
    paws: 42,
    comments: 8,
  },
  {
    author: "Dr. Jane Smith",
    pet: "Milo",
    time: "5 hours ago",
    category: "Care Tips",
    text: "Quick reminder: keep fresh water available throughout the day, especially for active pets and pets eating mostly dry food.",
    image: "/assets/profile/ducks.jpg",
    paws: 61,
    comments: 14,
  },
];

const trendingTopics = [
  { tag: "PetSafety", title: "Avoiding toxic plants in summer", count: "856 pet owners discussing" },
  { tag: "PuppyTraining", title: "Crate training for sleepy pups", count: "432 pet owners discussing" },
  { tag: "SeniorPets", title: "Joint support for older dogs", count: "211 pet owners discussing" },
];

const contributors = [
  { name: "Dr. Jane Smith", role: "Expert", photo: "/assets/doctors/anne.jpg" },
  { name: "Tom K.", role: "92 stories shared", photo: "/assets/doctors/milton.jpg" },
  { name: "Lisa W.", role: "Community Guide", photo: "/assets/doctors/olivia.jpg" },
];

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("All Discussions");
  const [communityPosts, setCommunityPosts] = useState(posts);
  const [story, setStory] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      const data = await loadCollection("communityPosts", posts);
      setCommunityPosts(data);
    };

    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!story.trim()) {
      alert("please write something first");
      return;
    }

    const post = {
      author: "PetSync Owner",
      pet: "My pet",
      time: "Just now",
      category: activeCategory === "All Discussions" ? "Stories" : activeCategory,
      text: story.trim(),
      image: "/assets/about-us/dog.jpg",
      paws: 0,
      comments: 0,
    };

    setCommunityPosts((current) => [post, ...current]);
    await saveDocument("communityPosts", post);
    console.log("community story posted:", post);
    alert("story posted successfully!");
    setStory("");
  };

  return (
    <main className="community-page">
      <aside className="community-left">
        <section className="community-card">
          <h2>Categories</h2>
          <div className="category-list">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "active" : ""}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="join-card">
          <h2>Join the Pack</h2>
          <p>Connect with local pet parents and share your journey.</p>
          <button type="button">Create account</button>
        </section>
      </aside>

      <section className="community-feed">
        <section className="composer-card">
          <img src="/assets/users/user-icon.svg" alt="User profile" />
          <div>
            <textarea
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share a story about your pet..."
              value={story}
            />
            <div className="composer-actions">
              <span>Photo</span>
              <span>Tag</span>
              <span>Mood</span>
              <button onClick={handlePost} type="button">
                Post Story
              </button>
            </div>
          </div>
        </section>

        {communityPosts.map((post) => (
          <article className="post-card" key={`${post.author}-${post.time}`}>
            <header>
              <img src="/assets/users/user-icon.svg" alt="" />
              <div>
                <h2>
                  {post.author} with <strong>{post.pet}</strong>
                </h2>
                <p>
                  {post.time} - {post.category}
                </p>
              </div>
              <button type="button">...</button>
            </header>
            <p>{post.text}</p>
            <img className="post-image" src={post.image} alt={`${post.pet} post`} />
            <footer>
              <span>{post.paws} Paws</span>
              <span>{post.comments} Comments</span>
              <button type="button">Share</button>
            </footer>
          </article>
        ))}
      </section>

      <aside className="community-right">
        <section className="community-card">
          <h2>Trending Topics</h2>
          <div className="topic-list">
            {trendingTopics.map((topic) => (
              <article key={topic.tag}>
                <span>#{topic.tag}</span>
                <h3>{topic.title}</h3>
                <p>{topic.count}</p>
              </article>
            ))}
          </div>
          <button className="outline-button" type="button">
            View all topics
          </button>
        </section>

        <section className="community-card">
          <h2>Top Contributors</h2>
          <div className="contributor-list">
            {contributors.map((person) => (
              <article key={person.name}>
                <img src={person.photo} alt={person.name} />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </div>
              </article>
            ))}
          </div>
          <button className="outline-button" type="button">
            Find friends
          </button>
        </section>
      </aside>
    </main>
  );
};

export default Community;
