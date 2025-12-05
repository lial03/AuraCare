import { Link } from 'react-router-dom';
import './PageLayout.css';

const PageHeader = ({ title, backLink = '/dashboard', userName = '' }) => {
  // Get the first letter of the user's name for the avatar
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="page-header">
      <Link to={backLink} className="page-header-back">
        « Back
      </Link>
      <h1 className="page-title">{title}</h1>
      <div className="user-avatar-small">{avatarLetter}</div>
    </div>
  );
};

export default PageHeader;
