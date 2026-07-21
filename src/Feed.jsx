import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "./utils/axios";
import { addFeed, removeUserFromFeed } from "./utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    if (feed) return;

    const fetchFeed = async () => {
      try {
        const res = await api.get("/feed");
        dispatch(addFeed(res.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeed();
  }, []);

  const handleSendRequest = async (status, userId) => {
    try {
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!feed) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  if (feed.length === 0) {
    return (
      <div className="flex justify-center mt-10">No new users to show</div>
    );
  }

  const currentUser = feed[0];

  return (
    <div className="flex justify-center mt-10">
      <UserCard
        key={currentUser._id}
        user={currentUser}
        onIgnore={() => handleSendRequest("ignored", currentUser._id)}
        onInterested={() => handleSendRequest("interested", currentUser._id)}
      />
    </div>
  );
};

export default Feed;
