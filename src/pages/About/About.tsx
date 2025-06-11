/* eslint-disable max-lines-per-function */
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
      <div>
        <p className="info">
          Our team successfully handled all tasks and successfully closed all tasks within the
          required time frame. We never had any problems within the team, difficulties or
          disagreements. We easily found a common language and easily discussed all points at our
          meetings. During this time everyone contributed to the overall development of the team.
          Each of us learned something new thanks to this work. I think that everyone in our team is
          happy that this is the kind of team we have made. During this time, each of us has managed
          to stand out in some way. <br />
          <br />
          Our team leader Dima managed the whole process perfectly, gave tasks, did reviews and
          wrote code perfectly. We are insanely grateful to him for his hard work and efforts! We
          learned a lot of things thanks to him. Dima showed us how to create routing between pages
          and it was Dima who wrote the first React component in our project, which gave us an
          example and an opportunity to move on! Dima also successfully completed the categories for
          the for our catalog! And completely made the profile himself, with his own changes and
          Dima also wrote tests for our project!
          <br />
          <br />
          Tanya did a great job with all her tasks. She was attentive and careful in writing code.
          Despite the difficulties she continued her work and never put her hands down, which is
          worthy of respect! All the jobs that Tanya did were not easy. It is thanks to Tanya that
          our API came into being! Tanya did a great job, she was extremely responsible in
          fulfilling our task and to achieve a common goal. Also, Tanya made the pages for our
          cards! And is in charge of pagination of our catalog!
          <br />
          <br />
          Egor was also good at his job. He always delivered tasks on time and was attentive to his
          code! Also to the code of his teammates. Egor always tried to help his teammates in better
          realization of the task with the help of reviews and gave advice on how to improve the
          code. Also Egor made catalog, filtering, search and makes this page! Egor also created
          initial forms for login and registration, wrote validation and tests for them!
          <br />
          <br />I hope that all the guys, like me, are extremely happy with our acquaintance and
          will remember this experience of working together as one of the best! Thank you all!
        </p>
      </div>

      <a href="https://rs.school/">
        <img className="logo-school" src={LogoSchool} alt="" />
      </a>
    </div>
  );
};

export default AboutUsPage;
