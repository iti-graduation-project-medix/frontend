import React, { useState } from "react";
import { Link } from "react-router-dom";

// Define the nested structure for categories and their articles
const CATEGORIES = [
  {
    key: "auth",
    label: "Authentication",
    children: [
      {
        key: "login",
        label: "How to Sign In",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">How to Sign In</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/auth/login" className="text-primary hover:underline">
                  <b>Sign In</b>
                </Link>{" "}
                page. You can usually find a <b>Login</b> or <b>Sign In</b>{" "}
                button on the homepage or in the navigation bar.
              </li>
              <li>
                Enter your registered <b>Email</b> and <b>Password</b> in the
                provided fields.
              </li>
              <li>
                Click the <b>Login</b> button.
              </li>
              <li>
                If your credentials are correct, you will be redirected to your
                dashboard or the main deals page.
              </li>
              <li>
                If you forgot your password, click the{" "}
                <Link
                  to="/auth/reset-password"
                  className="text-primary hover:underline"
                >
                  <b>Reset it</b>
                </Link>{" "}
                link below the password field and follow the instructions to
                reset your password.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "signup",
        label: "How to Sign Up",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">How to Sign Up</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link
                  to="/auth/signup"
                  className="text-primary hover:underline"
                >
                  <b>Sign Up</b>
                </Link>{" "}
                page. You can find a <b>Sign Up</b> or <b>Create Account</b>{" "}
                link on the login page or in the navigation bar.
              </li>
              <li>
                Fill in your <b>Personal Information</b> (Full Name, Email,
                Phone Number, Date of Birth, Gender, Password, and Confirm
                Password).
              </li>
              <li>
                Click <b>Next</b> to proceed to the <b>Documents</b> step.
              </li>
              <li>
                Upload the required documents:
                <ul className="list-disc list-inside ml-6">
                  <li>Front ID Card (JPG/PNG, max 5MB)</li>
                  <li>Back ID Card (JPG/PNG, max 5MB)</li>
                  <li>Work ID Card (JPG/PNG, max 5MB)</li>
                </ul>
              </li>
              <li>
                Enter your <b>National ID Number</b> (14 digits).
              </li>
              <li>
                Read and accept the{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  <b>Privacy Policy</b>
                </Link>{" "}
                and{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  <b>Terms of Service</b>
                </Link>{" "}
                by checking the box.
              </li>
              <li>
                Click <b>Create Account</b>. Your account will be created and
                submitted for review. You will receive an email with updates.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "change-password",
        label: "How to Change Password",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Change Password
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and find the <b>Security</b> section.
              </li>
              <li>Click the button to change your password.</li>
              <li>
                Enter your current password, then your new password, and confirm
                the new password.
              </li>
              <li>
                Click <b>Update Password</b> to save your changes.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "profile-management",
    label: "Profile Management",
    children: [
      {
        key: "update-profile-picture",
        label: "How to Update Profile Picture",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Update Profile Picture
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and find the <b>Personal Info</b> section.
              </li>
              <li>Click the option to change your profile picture.</li>
              <li>Upload your desired image (JPG/PNG, max 5MB).</li>
              <li>Confirm the upload to set your new profile picture.</li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
    children: [
      {
        key: "add-pharmacy",
        label: "How to Add a Pharmacy",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Add a Pharmacy
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and find the <b>My Pharmacies</b> section.
              </li>
              <li>
                If you have not added any pharmacies yet, click{" "}
                <Link
                  to="/pharmacies/new"
                  className="text-primary hover:underline"
                >
                  <b>Add Your First Pharmacy</b>
                </Link>
                . If you already have pharmacies, click{" "}
                <Link
                  to="/pharmacies/new"
                  className="text-primary hover:underline"
                >
                  <b>Add New Pharmacy</b>
                </Link>
                .
              </li>
              <li>
                Fill in the pharmacy form:
                <ul className="list-disc list-inside ml-6">
                  <li>
                    Enter <b>Pharmacy Name</b>, <b>License Number</b>,{" "}
                    <b>Contact Number</b>, <b>Start Hour</b>, and{" "}
                    <b>End Hour</b>.
                  </li>
                  <li>
                    Upload pharmacy images (optional, max 5 images, 5MB each).
                  </li>
                  <li>
                    Click <b>Next Step</b> to proceed to location and address
                    details.
                  </li>
                  <li>
                    Enter <b>Address Line 1</b>, <b>Address Line 2</b>{" "}
                    (optional), <b>City</b>, <b>Governorate</b>, and{" "}
                    <b>Zip Code</b>.
                  </li>
                  <li>
                    Set the pharmacy location on the map or use your current
                    location.
                  </li>
                </ul>
              </li>
              <li>
                Click <b>Add Pharmacy</b> to submit. You will be redirected to
                your pharmacy list.
              </li>
              <li>Note: You can add up to 2 pharmacies per account.</li>
            </ol>
          </article>
        ),
      },
      {
        key: "edit-pharmacy",
        label: "How to Edit a Pharmacy",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Edit a Pharmacy
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and scroll to the <b>My Pharmacies</b> section.
              </li>
              <li>Find the pharmacy you want to edit in your list.</li>
              <li>
                Click the <b>Edit</b> (pencil) icon next to the pharmacy
                details.
              </li>
              <li>
                Update the information as needed in the form that appears.
              </li>
              <li>
                Click <b>Update Pharmacy</b> to save your changes.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "delete-pharmacy",
        label: "How to Delete a Pharmacy",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Delete a Pharmacy
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and find the <b>My Pharmacies</b> section.
              </li>
              <li>Find the pharmacy you want to delete.</li>
              <li>
                Click the <b>Delete</b> (trash) icon next to the pharmacy
                details.
              </li>
              <li>
                Confirm the deletion in the dialog that appears. <b>Warning:</b>{" "}
                This action cannot be undone.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "list-unlist-pharmacy",
        label: "How to List or Unlist Pharmacy for Sale",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to List or Unlist Pharmacy for Sale
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  <b>Settings</b>
                </Link>{" "}
                and find the <b>My Pharmacies</b> section.
              </li>
              <li>Find the pharmacy you want to list or unlist.</li>
              <li>
                Click the <b>List for Sale</b> button to open the listing modal.
              </li>
              <li>
                Fill in the required sale details and confirm to list your
                pharmacy for sale.
              </li>
              <li>
                To unlist, click the <b>Unlist</b> or <b>Remove from Sale</b>{" "}
                button next to the listed pharmacy.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "deals",
    label: "Deals & Alerts",
    children: [
      {
        key: "add-deal",
        label: "How to Add a Deal",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">How to Add a Deal</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Navigate to{" "}
                <Link to="/my-deals" className="text-primary hover:underline">
                  <b>My Deals</b>
                </Link>{" "}
                from the main menu or dashboard.
              </li>
              <li>
                Click the{" "}
                <Link to="/deals/new" className="text-primary hover:underline">
                  <b>Create New Deal</b>
                </Link>{" "}
                button (usually at the top right of the My Deals page).
              </li>
              <li>
                Fill in the deal form:
                <ul className="list-disc list-inside ml-6">
                  <li>
                    Select the <b>Medicine Name</b> and <b>Dosage Form</b>.
                  </li>
                  <li>
                    Enter the <b>Quantity</b>, <b>Expiry Date</b>, and{" "}
                    <b>Price</b>.
                  </li>
                  <li>
                    Choose the <b>Deal Type</b> (Sell, Exchange, or Both).
                  </li>
                  <li>
                    Select the <b>Pharmacy</b> from which the deal is offered.
                  </li>
                  <li>
                    Optionally, add a <b>Description</b> and set the{" "}
                    <b>Box Status</b>.
                  </li>
                </ul>
              </li>
              <li>
                Click <b>Post Deal</b> to submit. If successful, you will be
                redirected to your deals list.
              </li>
              <li>
                If you have reached your deal posting limit, you may need to
                upgrade your subscription.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "filter-deals",
        label: "How to Use Filtering in All Deals",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Use Filtering in All Deals
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/deals" className="text-primary hover:underline">
                  <b>Available Deals</b>
                </Link>{" "}
                page from the main menu.
              </li>
              <li>Use the search bar to filter deals by medicine name.</li>
              <li>
                Use the dropdown menus to filter by <b>Type</b>,{" "}
                <b>Governorate</b>, <b>Dosage Form</b>, and <b>Sort By</b>.
              </li>
              <li>
                Click <b>Advanced</b> to open more filters, such as price range
                and expiry date.
              </li>
              <li>
                Click <b>Clear All</b> to reset all filters and see all
                available deals.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "drug-alert",
        label: "How to Make a Drug Alert & How It Works",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Make a Drug Alert & How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/deals" className="text-primary hover:underline">
                  <b>Available Deals</b>
                </Link>{" "}
                page.
              </li>
              <li>
                Click the <b>Drug Alert</b> button or section (usually at the
                top or in the filters area).
              </li>
              <li>
                Enter the medicine name and any specific criteria you want to be
                alerted about.
              </li>
              <li>
                Save the alert. You will receive notifications when a matching
                deal is posted.
              </li>
              <li>
                Drug alerts help you stay updated on new deals for specific
                medicines without checking manually.
              </li>
            </ol>
          </article>
        ),
      },
      {
        key: "chat",
        label: "How to Chat with a Specific Deal or Pharmacy",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Chat with a Specific Deal or Pharmacy
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/deals" className="text-primary hover:underline">
                  <b>Available Deals</b>
                </Link>{" "}
                or{" "}
                <Link to="/pharmacies" className="text-primary hover:underline">
                  <b>Pharmacies for Sale</b>
                </Link>{" "}
                page.
              </li>
              <li>Find the deal or pharmacy you are interested in.</li>
              <li>
                Click the <b>Chat</b> or <b>Message</b> button/icon associated
                with that deal or pharmacy.
              </li>
              <li>
                A chat window will open where you can type and send your message
                directly to the owner.
              </li>
              <li>
                You can view and continue your conversations from the{" "}
                <b>Chat</b> section in the main menu.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "subscription",
    label: "Subscription",
    children: [
      {
        key: "subscribe",
        label: "How to Subscribe",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">How to Subscribe</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link
                  to="/subscription"
                  className="text-primary hover:underline"
                >
                  <b>Subscription</b>
                </Link>{" "}
                or <b>Billing</b> section.
              </li>
              <li>
                Review the available subscription plans and their features.
              </li>
              <li>
                Click <b>Subscribe</b> or <b>Upgrade</b> on your chosen plan.
              </li>
              <li>
                Follow the payment instructions to complete your subscription.
              </li>
              <li>
                Once payment is successful, your account will be upgraded and
                you will receive a confirmation.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "advertising",
    label: "Advertising",
    children: [
      {
        key: "advertise-with-us",
        label: "How to Advertise with Us",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">
              How to Advertise with Us
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/advertise" className="text-primary hover:underline">
                  <b>Advertise</b>
                </Link>{" "}
                page from the main menu or footer.
              </li>
              <li>Review the advertising options and packages available.</li>
              <li>
                Fill out the advertising form with your details and ad
                requirements.
              </li>
              <li>
                Submit the form, and our team will contact you to finalize the
                advertisement.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
  {
    key: "support",
    label: "Support",
    children: [
      {
        key: "contact-us",
        label: "How to Contact Us",
        content: (
          <article>
            <h2 className="text-2xl font-semibold mb-2">How to Contact Us</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to the{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  <b>Contact Us</b>
                </Link>{" "}
                page from the main menu or footer.
              </li>
              <li>
                Fill in the contact form with your name, email, subject, and
                message.
              </li>
              <li>
                Click <b>Send Message</b>. Our support team will get back to you
                as soon as possible.
              </li>
            </ol>
          </article>
        ),
      },
    ],
  },
];

export default function UserManual() {
  // Find the first leaf node for default selection
  function getFirstLeaf(categories) {
    for (const cat of categories) {
      if (cat.children) {
        const leaf = getFirstLeaf(cat.children);
        if (leaf) return leaf;
      } else {
        return cat;
      }
    }
    return null;
  }
  const firstLeaf = getFirstLeaf(CATEGORIES);
  const [selected, setSelected] = useState(firstLeaf?.key || "");
  // For collapsible categories
  const [openCats, setOpenCats] = useState(
    () => [] // Changed to empty array to make all categories closed by default
  );

  function renderSidebar(categories) {
    return (
      <nav className="space-y-2">
        {categories.map((cat) =>
          cat.children ? (
            <div key={cat.key}>
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-colors border bg-gray-50 dark:bg-background border-gray-200 dark:border-border mb-1 ${
                  openCats.includes(cat.key)
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-200"
                }`}
                onClick={() =>
                  setOpenCats((prev) =>
                    prev.includes(cat.key)
                      ? prev.filter((k) => k !== cat.key)
                      : [...prev, cat.key]
                  )
                }
              >
                {cat.label}
                <span className="float-right">
                  {openCats.includes(cat.key) ? "-" : "+"}
                </span>
              </button>
              {openCats.includes(cat.key) && (
                <div className="ml-2 border-l border-gray-200 dark:border-border pl-2">
                  {renderSidebar(cat.children)}
                </div>
              )}
            </div>
          ) : (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors border mb-1
                ${
                  selected === cat.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-background text-primary border-gray-200 dark:border-border hover:bg-primary/10"
                }
              `}
            >
              {cat.label}
            </button>
          )
        )}
      </nav>
    );
  }

  // Find the selected section content
  function findSection(categories, key) {
    for (const cat of categories) {
      if (cat.children) {
        const found = findSection(cat.children, key);
        if (found) return found;
      } else if (cat.key === key) {
        return cat;
      }
    }
    return null;
  }
  const selectedSection = findSection(CATEGORIES, selected);

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="md:w-1/3 w-full mb-4 md:mb-0">
        {renderSidebar(CATEGORIES)}
      </aside>
      {/* Article Content */}
      <main className="flex-1 bg-white dark:bg-background rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary">User Manual</h1>
        {selectedSection?.content}
      </main>
    </div>
  );
}
