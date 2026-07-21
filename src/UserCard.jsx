import React from "react";

const UserCard = ({ user, onIgnore, onInterested }) => {
  const { firstName, lastName, age, gender, about, skills, photoUrl } = user;

  return (
    <div className="card card-border bg-base-100 w-80 shadow-sm">
      <figure className="h-64">
        <img
          src={photoUrl}
          alt={firstName}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
          {age ? <span className="text-sm font-normal">, {age}</span> : null}
        </h2>
        {gender && <p className="text-sm capitalize">{gender}</p>}
        {about && <p className="text-sm mt-2">{about}</p>}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <span key={skill} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="card-actions justify-center mt-4">
          <button className="btn btn-outline" onClick={onIgnore}>
            Ignore
          </button>
          <button className="btn btn-primary" onClick={onInterested}>
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
