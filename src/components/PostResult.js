import React from 'react';

function PostResult({ postResult }) {
  return (
    <div>
      {postResult && (
        <div>
          <p>Target Posts:</p>
          <ul>
            {postResult.map((posts, index) => (
              <li key={index}>
                <a href={posts.post} target="_blank" rel="noopener noreferrer">
                  {posts.post}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PostResult;
