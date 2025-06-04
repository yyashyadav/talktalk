import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "TalkTalk - Chat Application",
  description = "This is a scalable Chat WebApp called TalkTalk",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
