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
    hearts: 18,
    support: 6,
    following: true,
    verified: false,
    postType: "story",
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
    hearts: 24,
    support: 19,
    following: false,
    verified: true,
    postType: "expert",
    officialAnswer: "Fresh water and shade are the safest first steps for active pets in warm weather.",
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

const challenges = [
  { title: "Weekly Trick Challenge", prompt: "Post a photo or clip of your pet's newest trick.", entries: 128 },
  { title: "Hydration Check-In", prompt: "Share your pet's favorite water routine.", entries: 74 },
];

const packMembers = [
  { name: "Sarah H.", status: "Reacted to your reminder", photo: "/assets/users/user-icon.svg" },
  { name: "Tom K.", status: "Sent training advice", photo: "/assets/doctors/milton.jpg" },
  { name: "Lisa W.", status: "Shared a care checklist", photo: "/assets/doctors/olivia.jpg" },
];

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("All Discussions");
  const [communityPosts, setCommunityPosts] = useState(posts);
  const [story, setStory] = useState("");
  const [feedMode, setFeedMode] = useState("forYou");
  const [postType, setPostType] = useState("story");
  const [pollOption, setPollOption] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [messageTarget, setMessageTarget] = useState(null);

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
      hearts: 0,
      support: 0,
      following: true,
      verified: postType === "expert",
      postType,
      pollOption: postType === "poll" ? pollOption : "",
      officialAnswer: postType === "expert" ? "A participating veterinarian can pin an official response here." : "",
      scheduledFor,
    };

    setCommunityPosts((current) => [post, ...current]);
    await saveDocument("communityPosts", post);
    console.log("community story posted:", post);
    alert("story posted successfully!");
    setStory("");
    setPollOption("");
    setScheduledFor("");
  };

  const handleSaveDraft = () => {
    if (!story.trim()) {
      alert("please write something first");
      return;
    }

    setDrafts((current) => [
      {
        text: story.trim(),
        type: postType,
        savedAt: "Saved just now",
      },
      ...current,
    ]);
    setStory("");
  };

  const addReaction = (postKey, reaction) => {
    setCommunityPosts((current) =>
      current.map((post) =>
        `${post.author}-${post.time}` === postKey
          ? { ...post, [reaction]: (post[reaction] || 0) + 1 }
          : post
      )
    );
  };

  const visiblePosts = communityPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Discussions" || post.category === activeCategory;
    const matchesFeed = feedMode === "forYou" || post.following;

    return matchesCategory && matchesFeed;
  });

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

        <section className="community-card challenge-card">
          <h2>Weekly Challenges</h2>
          {challenges.map((challenge) => (
            <article key={challenge.title}>
              <strong>{challenge.title}</strong>
              <p>{challenge.prompt}</p>
              <span>{challenge.entries} entries</span>
            </article>
          ))}
        </section>
      </aside>

      <section className="community-feed">
        <div className="feed-toggle" aria-label="Community feed type">
          <button
            className={feedMode === "forYou" ? "active" : ""}
            onClick={() => setFeedMode("forYou")}
            type="button"
          >
            For You
          </button>
          <button
            className={feedMode === "following" ? "active" : ""}
            onClick={() => setFeedMode("following")}
            type="button"
          >
            Following
          </button>
        </div>

        <section className="composer-card">
          <img src="/assets/users/user-icon.svg" alt="User profile" />
          <div>
            <div className="composer-type-row">
              {["story", "poll", "expert"].map((type) => (
                <button
                  className={postType === type ? "active" : ""}
                  key={type}
                  onClick={() => setPostType(type)}
                  type="button"
                >
                  {type === "expert" ? "Ask an Expert" : type}
                </button>
              ))}
            </div>
            <textarea
              onChange={(e) => setStory(e.target.value)}
              placeholder={postType === "poll" ? "Ask your poll question..." : "Share a story about your pet..."}
              value={story}
            />
            {postType === "poll" && (
              <input
                className="poll-option-input"
                onChange={(e) => setPollOption(e.target.value)}
                placeholder="Add a poll option"
                value={pollOption}
              />
            )}
            <div className="composer-actions">
              <span>Photo</span>
              <span>Tag</span>
              <span>Mood</span>
              <label>
                Schedule
                <input
                  onChange={(e) => setScheduledFor(e.target.value)}
                  type="datetime-local"
                  value={scheduledFor}
                />
              </label>
              <button className="draft-button" onClick={handleSaveDraft} type="button">
                Save Draft
              </button>
              <button onClick={handlePost} type="button">
                Post Story
              </button>
            </div>
            {drafts.length > 0 && (
              <div className="draft-list">
                <strong>Drafts</strong>
                {drafts.map((draft) => (
                  <span key={`${draft.savedAt}-${draft.text}`}>{draft.savedAt}: {draft.text}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {visiblePosts.map((post) => {
          const postKey = `${post.author}-${post.time}`;

          return (
          <article className={`post-card ${post.verified ? "verified-post" : ""}`} key={postKey}>
            <header>
              <img src="/assets/users/user-icon.svg" alt="" />
              <div>
                <h2>
                  {post.author} with <strong>{post.pet}</strong>
                  {post.verified && <span className="verified-badge">Verified</span>}
                </h2>
                <p>
                  {post.time} - {post.category}
                </p>
              </div>
              <button type="button">...</button>
            </header>
            <p>{post.text}</p>
            {post.postType === "poll" && (
              <div className="poll-card">
                <strong>Poll</strong>
                <button type="button">{post.pollOption || "Option 1"}</button>
                <button type="button">Other</button>
              </div>
            )}
            {post.officialAnswer && (
              <div className="expert-answer">
                <strong>Pinned expert response</strong>
                <p>{post.officialAnswer}</p>
              </div>
            )}
            <img className="post-image" src={post.image} alt={`${post.pet} post`} />
            <footer>
              <button onClick={() => addReaction(postKey, "paws")} type="button">
                {post.paws} Paws
              </button>
              <button onClick={() => addReaction(postKey, "hearts")} type="button">
                {post.hearts || 0} Hearts
              </button>
              <button onClick={() => addReaction(postKey, "support")} type="button">
                {post.support || 0} Support
              </button>
              <span>{post.comments} Comments</span>
              <button onClick={() => setMessageTarget(post.author)} type="button">
                Message
              </button>
              <button type="button">Share</button>
            </footer>
          </article>
        );
        })}
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
          <h2>My Pack</h2>
          <div className="contributor-list">
            {packMembers.map((person) => (
              <article key={person.name}>
                <img src={person.photo} alt={person.name} />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.status}</span>
                </div>
              </article>
            ))}
          </div>
          <button className="outline-button" type="button">
            Manage Pack
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
        </section>
      </aside>

      {messageTarget && (
        <div className="community-modal-backdrop" role="presentation">
          <section className="community-message-modal" role="dialog" aria-modal="true">
            <span>Direct Message</span>
            <h2>Message {messageTarget}</h2>
            <textarea placeholder="Write a private message..." rows="5" />
            <div>
              <button type="button" onClick={() => setMessageTarget(null)}>
                Send Message
              </button>
              <button type="button" onClick={() => setMessageTarget(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Community;
