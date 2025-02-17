import React from 'react'

export default function Post() {
  return (
    <div>
        <div className="post">
        <div className="image">
          <img
            src="https://techcrunch.com/wp-content/uploads/2025/01/GettyImages-2173579488.jpg?resize=927,617"
            alt=" "
          />
        </div>
        <div className="texts">
          <h2>
            Court filings show Meta paused efforts to license books for AI
            training
          </h2>
          <p className="info">
            <a className="author">Shivam Gurjar</a>
            <time>2025-01-06 15:45</time>
          </p>
          <p className="summary">
            New court filings in an AI copyright case against Meta add credence
            to earlier reports that the company “paused” discussions with book
            publishers on licensing deals to supply some of its generative AI
            models with training data.
          </p>
        </div>
      </div>
    </div>
  )
}
