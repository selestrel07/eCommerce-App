import { Button, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { Paths } from '../../enums/paths/paths.ts';

export default function NotFound() {
  return (
    <>
      <Empty description={false} />
      <div className="not-found-container">
        <h1>Ooops...</h1>
        <h2>It looks like this page doesn't exist!</h2>
        <h3>
          Please click the button below or use the links in the header to continue working with the
          application.
        </h3>
      </div>
      <Link to={Paths.MAIN}>
        <Button size="large" color="blue" variant="solid">
          Go to the Main page
        </Button>
      </Link>
    </>
  );
}
