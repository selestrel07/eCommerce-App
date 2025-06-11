import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import DimaImg from '../../assets/aboutUs/member_1.jpg';
import TanyaImg from '../../assets/aboutUs/member_2.jpg';
import EgorImg from '../../assets/aboutUs/member_3.jpg';
import LogoSchool from '../../assets/aboutUs/logo_school.png';
import LogoGit from '../../assets/aboutUs/git_logo.png';
import './About.scss';

const { Title } = Typography;
const GRID_GUTTER = 32;

export const AboutUsPage: React.FC = () => {
  return (
    <div>
      <Title className="about-title" level={2}>
        About Us
      </Title>
      <a href="https://rs.school/">
        <img className="logo-school" src={LogoSchool} alt="" />
      </a>

      <Row gutter={[GRID_GUTTER, GRID_GUTTER]}>
        <Col xs={24} md={8}>
          <Card cover={<img alt="member1" src={DimaImg} />}>
            <Card.Meta title="Dzmitry Kulevich" />

            <Card.Meta
              title="Team Lead/Developer"
              description="About me: graduated from BSU with a degree in Mathematics (teacher of mathematics and computer science), 2 years worked in school as a teacher of mathematics and computer science, then in a bank as a tester and system analyst, then moved to IT and worked as QA Automation in two companies. Hobbies: I like to learn something new (more often IT related), read, play video games, go to soccer with my wife.
"
            />
            <a href="https://github.com/selestrel07">
              <img className="logo-git" src={LogoGit} alt="" />
            </a>
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
"
            />
            <a href="https://github.com/isvaya">
              <img className="logo-git" src={LogoGit} alt="" />
            </a>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card cover={<img alt="member3" src={EgorImg} />}>
            <Card.Meta title="Egor Zhitkovski" />
            <Card.Meta
              title="Developer"
              description="About me: from an early age I have been interested in programming and learning about it. As early as 12 years old, I was learning languages such as: Pascal ABC, Python, and many other block programming languages. I was insanely interested in all this and with each year the attraction only grew. In the 11th grade I got to RSSchool for the first time, but in the same year I finished my studies in this place. But I did not put my hands down and continued to study but in other courses to be ready for RSSchool. After school I entered BNTU, a technical university and now I am an engineer! While studying at the university and RSSchool, I work as a programming teacher for children.
My hobbies are: Development, programming, computer games and technology.  
"
            />
            <a href="https://github.com/heresyhawkins">
              <img className="logo-git" src={LogoGit} alt="" />
            </a>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUsPage;
