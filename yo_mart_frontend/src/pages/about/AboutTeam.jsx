import React from "react";
import { Users } from "lucide-react";
import { Card, Row, Col, Avatar } from "antd";

const teamMembers = [
  {
    name: "Tho Panha",
    position: "Web Developer  Mobile App Developer ",
    role: "Team Leader",
    major: "Computer Science",
    semester: 2,
    profileImage:
      "https://scontent.fpnh1-1.fna.fbcdn.net/v/t39.30808-6/614410150_1813091619395975_3388392932362546197_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeFt8TrXCURAp4OloiBiZp_zFskSejKkXeMWyRJ6MqRd47mg57UFIWYlsehOzvu8iDwoeNcUuumQloVPn83B_CIG&_nc_ohc=n7JQbaUjGEwQ7kNvwFF6Mwr&_nc_oc=AdrOTesOhRpilQoGTeAoMyvAwoBgIHI6xH7hF3zB-vg_RdOJBWLP7OEYiO_BgAucQ7A&_nc_zt=23&_nc_ht=scontent.fpnh1-1.fna&_nc_gid=4vyYqSxkbM0nBRZv0bIQDg&_nc_ss=7a32e&oh=00_Afw1zHDT7J5hVwTZYOUmVpI40B59KJo9TwXgEsqScX14QQ&oe=69CD7C3B",
    info: {
      email: "thopanha123@gmail.com",
      phone: "087531319",
      location: "Phnom Penh, Cambodia",
    },
  },
  {
    name: "By Vibol",
    position: "Frontend Developer",
    role: "Team Member",
    major: "Computer Science",
    semester: 2,
    profileImage:
      "https://scontent.fpnh1-1.fna.fbcdn.net/v/t39.30808-1/604700239_1434791114837804_1421095137715549394_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH7Edj7L8VcIfHcgxmSuImyeqeprOumGbx6p6ms66YZvIdjQ84R2kYwhg99QHGweh8RqECEVI_zWXZ1ZHTWgqk1&_nc_ohc=XUyaz-GkBUMQ7kNvwF47Qp1&_nc_oc=Adq1xDSMYNnohsMERdqMm1-DuwGLd5WCy35cxGXv_mya0yh9-WZqUldLiiPKdLtoNZo&_nc_zt=24&_nc_ht=scontent.fpnh1-1.fna&_nc_gid=M0p53HcdEnLrk9Zvynq7bg&_nc_ss=7a32e&oh=00_AfzWeIRQ_ha7F7iTwD7Cw6ZSTcQhoagjq_vHe1Gy-NXang&oe=69CD9B59",
    info: {
      email: "byvibol@gmail.com",
      phone: "0987654321",
      location: "Phnom Penh, Cambodia",
    },
  },
  {
    name: "Roth Angkeamanet",
    position: "Full Stack Developer",
    role: "Team Member",
    major: "Computer Science",
    semester: 2,
    profileImage:
      "https://scontent.fpnh1-2.fna.fbcdn.net/v/t39.30808-1/627049061_923953590166598_2007087648705675668_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHk_1oxHmSu76NLov5cVciMqlUXgICW7EmqVReAgJbsSUvJCXdE33QK7w0x5L6yEH9CBCFTiHk-A6XlBu7bfHVK&_nc_ohc=sPC7d_w_T1sQ7kNvwFwQjOP&_nc_oc=Adooy5oKpE335ZXwq6zhPiu6C22nGHhV3UOJQNjrAjzf5DZAKTodckBxOA1A4uX2mpk&_nc_zt=24&_nc_ht=scontent.fpnh1-2.fna&_nc_gid=6P8OzVxZTxXS-LSl5E8_Cw&_nc_ss=7a32e&oh=00_AfwgyGWxn950TV3fQp5HIXxe3saOJdvKOyJyMA-Q7JLRmQ&oe=69CD8D1A",
    info: {
      email: "rothangkeamanet@gmail.com",
      phone: "0987654321",
      location: "Phnom Penh, Cambodia",
    },
  },
];

const AboutTeam = () => {
  return (
    <div style={{ padding: "20px" }}>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <Users size={28} style={{ marginRight: 8, color: "#1890ff" }} />
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>អំពីក្រុម</h1>
      </div>

      {/* Team Members */}
      <Row gutter={[16, 16]}>
        {teamMembers.map((member, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              cover={
                <Avatar
                  size={128}
                  src={member.profileImage}
                  style={{ margin: "16px auto" }}
                />
              }
            >
              <Card.Meta
                title={member.name}
                description={
                  <>
                    <p>{member.position}</p>
                    <p>{member.role}</p>
                    <p>
                      Major: <strong>{member.major}</strong>, Semester:{" "}
                      <strong>{member.semester}</strong>
                    </p>
                    <p>Email: {member.info.email}</p>
                    <p>Phone: {member.info.phone}</p>
                    <p>Location: {member.info.location}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AboutTeam;
