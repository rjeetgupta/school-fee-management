# Student Fee Management System - Requirements Specification

## Project Overview

The project is a **Student Fee Management System** that enables educational institutions to manage student records, monthly fee collection, payment history, and outstanding dues. The application consists of two user roles:

* **Admin**
* **Student**

The system includes **Razorpay payment integration** for online fee collection and also supports **cash payments** recorded by the admin.

---

# Functional Requirements

## 1. Authentication

### Student Authentication

* Every student is assigned a unique **Student ID**.
* Each student's **Date of Birth (DOB)** is stored in the system.
* Students can log in using their **Student ID** and **DOB**.
* After successful authentication, students can securely access their own accounts.
* Students can only view and manage information related to their own profile.

### Admin Authentication

* The admin has secure system-level access.
* The admin can access all modules and manage the entire application.

---

# 2. Student Module

After logging in, students should be able to:

## Profile

* View personal information.
* View student details.
* View monthly fee details.
* View complete payment history.

## Fee Details

* Display fees on a monthly basis.
* Show the payment status for each month.
* Clearly identify:

  * Paid months
  * Pending months
  * Carry-forward dues

## Online Fee Payment

Students can pay their fees online using **Razorpay**.

Supported payment methods include:

* UPI
* Debit Card
* Credit Card
* Net Banking
* Wallets
* Any other payment method supported by Razorpay

### Successful Payment

After a successful payment:

* Payment is verified.
* Fee status is updated automatically.
* Payment history is updated.
* Outstanding dues are reduced accordingly.

### Failed Payment

If a payment:

* Fails
* Is cancelled
* Times out

Then:

* No fee records are modified.
* The payment status is marked as failed.
* Students can retry the payment later.

---

# 3. Due Fee Management

The system should maintain pending fee records.

If a student is unable to pay the fee for a particular month:

* The unpaid fee is carried forward to the following month.
* The due amount remains outstanding until paid.
* Students can view all pending months.
* Students can view the total outstanding amount.
* Once payment is completed, the due records are updated automatically.

---

# 4. Admin Module

The admin has complete control over the system.

## Student Management

The admin can perform full CRUD operations:

* Create Student
* View Student
* Update Student
* Delete Student

The admin can also:

* Search students using a search box.
* View student profiles.
* View payment history.
* View fee details.
* View pending dues.

---

## Fee Collection

The admin can collect fees on behalf of any student.

Payment methods supported:

### Online Payment

The admin can initiate an online payment using Razorpay.

### Cash Payment

If a student pays in cash:

* The admin records the payment manually.
* The student's monthly fee status is updated.
* The payment is added to the student's payment history.
* Outstanding dues are updated automatically.

---

# 5. Razorpay Payment Integration

The application should integrate with Razorpay for secure online payments.

Features include:

* Create payment order.
* Initiate payment.
* Verify payment signature.
* Store transaction details.
* Update payment status.
* Handle payment failures.
* Prevent duplicate payments.
* Maintain complete payment logs.

---

# 6. Payment History

Every successful payment should be stored with:

* Student Name
* Student ID
* Payment ID
* Order ID
* Transaction ID (if available)
* Amount Paid
* Payment Method
* Payment Date
* Payment Status
* Month(s) for which the payment was made

Students and admins should be able to view the complete payment history.

---

# 7. Search Functionality

The admin should be able to search students using:

* Student Name
* Student ID

The search results should allow quick access to:

* Student profile
* Fee details
* Payment history
* Due fees
* Payment options

---

# 8. Fee Status

Each month's fee should have one of the following statuses:

* Paid
* Unpaid
* Carry Forward
* Partially Paid (optional, if implemented)

---

# 9. Dashboard (Optional)

## Student Dashboard

Display:

* Personal information
* Total fees
* Paid amount
* Outstanding amount
* Pending months
* Recent payment history

## Admin Dashboard

Display:

* Total students
* Total fees collected
* Total pending fees
* Recent payments
* Cash payments
* Online payments
* Number of overdue students

---

# Non-Functional Requirements

* Secure authentication.
* Responsive user interface.
* Fast search functionality.
* Secure payment processing.
* Reliable transaction handling.
* Proper error handling and validation.
* Data consistency after payment.
* Role-based access control.
* Scalable architecture for future enhancements.

---

# Technology Requirements

Frontend:

* React.js

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Payment Gateway:

* Razorpay

Authentication:

* Student ID + Date of Birth (Student)
* Admin Login Credentials

---

# Future Enhancements

* Email payment receipts.
* SMS notifications.
* Fee reminders.
* Download payment receipts as PDF.
* Excel export of payment records.
* Multiple fee categories.
* Scholarship and discount management.
* Student attendance integration.
* Parent login portal.
* Reports and analytics dashboard.

---

# User Flow

## Student Flow

1. Student opens the application.
2. Student logs in using Student ID and DOB.
3. Student views profile.
4. Student checks monthly fee details.
5. Student views pending dues.
6. Student selects a payment method.
7. Razorpay processes the payment.
8. On successful payment:

   * Fee status is updated.
   * Payment history is updated.
9. If payment fails:

   * No records are changed.
   * Student can retry later.

---

## Admin Flow

1. Admin logs into the system.
2. Admin searches for a student.
3. Admin views the student's profile and fee details.
4. Admin collects payment:

   * Online via Razorpay, or
   * Cash payment.
5. Payment records are updated.
6. Student payment history reflects the transaction.
7. Any outstanding dues are recalculated and updated.

---

# Conclusion

The Student Fee Management System provides a secure and efficient solution for managing student fees. Students can securely log in, view their fee details, monitor outstanding dues, and make online payments through Razorpay. Administrators have complete control over student management, fee collection, payment tracking, and cash payment recording. The system ensures accurate monthly fee management, automatic updates to payment history, and proper handling of due fees carried forward to future months.
