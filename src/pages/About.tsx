import AboutUs from '../assets/about.png';

const About = () => {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-4 m-10">
      <div className="flex justify-center items-center">
        <img src={AboutUs} alt="Team Prometheus" className="rounded-md" />
      </div>  
      <div className="flex flex-col justify-center pe-20 gap-6">
        <h1 className="text-5xl font-semibold text-primary leading-tight">
          Meet Team PROMETHEUS
        </h1>
        <section className="mb-4">
        <ul className="list-disc list-inside text-gray-700">
            <li><strong>Mayank Kushwaha</strong></li>
            <li><strong>Niharika Singh</strong></li>
            <li><strong>Sahil Patel</strong></li>
            <li><strong>Shreyash Gupta</strong></li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-4xl font-semibold text-primary opacity-70">Our Project</h2>
          <p className="text-primary mt-5 mb-7">
            For this hackathon, we are excited to present our project, <strong>Contovar</strong>. Our goal is to build an all-in-one platform that makes Interview Process easy for Interviewer as well as Interviewee!
          </p>
          <h3 className="text-4xl font-semibold text-primary opacity-70 mb-5">Key Features</h3>
          <ul className="list-disc list-inside text-gray-700 mb-5">
            <li><strong>In-built Compiler:</strong> An in-built compiler to test your code!</li>
            <li><strong>Whiteboard:</strong> A virtual space to brainstorm and visualize your ideas!</li>
            <li><strong>Mock Interview:</strong> Simulate real interview scenarios to boost your confidence!</li>
            <li><strong>Interview Prepare:</strong> Comprehensive resources to help you ace your interviews!</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
