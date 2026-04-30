import React from "react";
import { Users } from "lucide-react";
import { Card, Row, Col, Avatar } from "antd";
import panha from "../../assets/dev/panha.jpg";
import manet from "../../assets/dev/manet.jpg";
import vibol from "../../assets/dev/vibol.jpg";

const teamMembers = [
  {
    name: "Tho Panha",
    position: "Web Developer  Mobile App Developer ",
    role: "Team Leader",
    major: "Computer Science",
    semester: 2,
    profileImage: panha,
    info: {
      email: "thopanha123@gmail.com",
      phone: "087531319",
      location: "Phnom Penh, Cambodia",
    },
  },
  {
    name: "By Vibol",
    position: "Frontend Developer, Linux Administrator, Server Hosing",
    role: "Team Member",
    major: "Computer Science",
    semester: 2,
    profileImage: vibol,
    info: {
      email: "byvibol@gmail.com",
      phone: "0987654321",
      location: "Phnom Penh, Cambodia",
    },
  },
  {
    name: "Roth Angkeamanet",
    position: "Full Stack Developer,Linux Administrator, Server Hosing",
    role: "Team Member",
    major: "Computer Science",
    semester: 2,
    profileImage: manet,
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
