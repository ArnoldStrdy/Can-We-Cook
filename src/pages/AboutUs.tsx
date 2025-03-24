import React, { useState } from "react";



const AboutUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    findUs: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section id="cs-contact-242" className="py-10 px-5 bg-gray-100 dark:bg-gray-900 mt-10">
      {/* About Us section ABOVE the form */}
      <div className="max-w-3xl mx-auto text-center lg:text-left mb-10">
        <h2 className="text-3xl font-bold">About Us</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          At Can We Cook?, we're passionate about helping the Monash University community discover the best food spots on and around campus. Whether you're looking for a quick bite, hidden gems, or honest reviews from fellow students, we've got you covered. Share your experiences, explore menus, and connect with the vibrant food culture at Monash.
        </p>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-10">
        {/* Form and other content */}

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <label className="block mb-4">
            Name
            <input
              className="w-full mt-2 p-2 border rounded"
              required
              type="text"
              name="name"
              placeholder="John/Jane Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label className="block mb-4">
            Email
            <input
              className="w-full mt-2 p-2 border rounded"
              required
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className="block mb-4">
            Phone
            <input
              className="w-full mt-2 p-2 border rounded"
              required
              type="text"
              name="phone"
              placeholder="+1 (206) 987-6543"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <label className="block mb-4">
            How Did You Find Us
            <input
              className="w-full mt-2 p-2 border rounded"
              type="text"
              name="findUs"
              placeholder="Social Media, Family, Friend..."
              value={formData.findUs}
              onChange={handleChange}
            />
          </label>
          <label className="block mb-4">
            Message
            <textarea
              className="w-full mt-2 p-2 border rounded"
              required
              name="message"
              placeholder="Hello, I am interested in..."
              value={formData.message}
              onChange={handleChange}
            />
          </label>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            type="submit"
          >
            Submit Message Now
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="mt-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <h3 className="font-bold">Email</h3>
          <a href="mailto:whea0002@student.monash.edu" className="text-blue-500">whea0002@student.monash.edu</a>
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Phone</h3>
          <a href="tel:0401710315" className="text-blue-500">0401710315</a>
        </div>
        <div>
          <h3 className="font-bold">Address</h3>
          <p>Wellington Road, Clayton, Victoria 3800</p>
        </div>
      </div>

      {/* Google Map Embed */}
      <div className="mt-10 flex justify-center">
        <iframe
          src="https://use.mazemap.com/embed.html#v=1&campusid=159&zlevel=1&center=145.133167,-37.911460&zoom=16.4&utm_medium=iframe"
          height="450"
          className="border-0 w-full max-w-4xl"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default AboutUs;
