import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import DimaImg from '../../assets/aboutUs/member_1.jpg';
import TanyaImg from '../../assets/aboutUs/member_2.jpg';
import EgorImg from '../../assets/aboutUs/member_3.jpg';
import './About.scss';

const { Title } = Typography;
const GRID_GUTTER = 32;

export const AboutUsPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        About Us
      </Title>

      <Row gutter={[GRID_GUTTER, GRID_GUTTER]}>
        <Col xs={24} md={8}>
          <Card cover={<img alt="member1" src={DimaImg} />}>
            <Card.Meta title="Dzmitry Kulevich" />

            <Card.Meta
              title="Team Lead/Developer"
              description="About me: graduated from BSU with a degree in Mathematics (teacher of mathematics and computer science), 2 years worked in school as a teacher of mathematics and computer science, then in a bank as a tester and system analyst, then moved to IT and worked as QA Automation in two companies. Hobbies: I like to learn something new (more often IT related), read, play video games, go to soccer with my wife.

Translated with DeepL.com (free version)"
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card cover={<img alt="member2" src={TanyaImg} />}>
            <Card.Meta title="Tatyana Pavlyuchenko" />
            <Card.Meta
              title="Developer"
              description="About me:
I graduated from a foreign languages lyceum with a degree in foreign philology. After my studies I worked in a company producing fire-fighting equipment, soldering boards. Then I moved to a distribution company as a sales agent.

During my maternity leave I got interested in digital art and then in frontend development. Now this is my new professional direction and area of constant development.

Among my hobbies are reading books, constantly striving for self-development, video games, long walks and cooking: I love to cook and delight my loved ones with my dishes.

Translated with DeepL.com (free version)"
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card cover={<img alt="member3" src={EgorImg} />}>
            <Card.Meta title="Egor Zhitkovski" />
            <Card.Meta title="Developer" description="sdasd" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUsPage;
