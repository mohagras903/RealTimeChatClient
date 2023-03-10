import { Friend } from "../../../../interfaces";
import Image from "next/image";
import styles from "../../Sidebars.module.scss";
import userIcon from "../../../../public/images/user-black.png";
import { useContext } from "react";
import { chatScreenContext } from "../../../../Contexts";
import { motion } from "framer-motion";
const viewport = require("viewport-dimensions");

export default function FriendsList({ friends }: { friends: Array<Friend> }) {
  const { setNewChat, existingChats, setSelectedChat, setDisplayMode } =
    useContext(chatScreenContext);

  const handleClickOnFriend = (username: string) => {
    if (viewport.width() < 670) {
      setDisplayMode(3);
    } else {
      setDisplayMode(1);
    }
    if (!existingChats.includes(username)) {
      setNewChat(username);
    } else {
      setSelectedChat(username);
    }
  };
  return (
    <motion.div className={styles["friends-list"]}>
      {friends?.map((friend, index) => {
        return (
          <div
            className={`horizontal-left-aligned-container ${styles["friend-item"]}`}
            key={index}
            onClick={() => handleClickOnFriend(friend.username)}
          >
            <Image
              src={friend.imageUrl === "" ? userIcon : friend.imageUrl}
              width={35}
              height={35}
              alt="logo"
              className="user-image"
            />
            <h3>{friend.username}</h3>
          </div>
        );
      })}
    </motion.div>
  );
}
