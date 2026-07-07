# Comprehensive Test Plan - Loki-Dhaka CRM

## Executive Summary

This document outlines the complete testing strategy for Loki-Dhaka, a Node.js-based Customer Relationship Management (CRM) application. The test plan covers functional, non-functional, security, and performance testing aspects.

**Test Scope:**
- Authentication & Authorization
- Customer Management
- Lead & Opportunity Tracking
- Task & Activity Management
- Reporting & Analytics
- API Endpoints
- Database Integrity
- Security
- Performance

**Testing Environment:**
- Node.js v18+
- PostgreSQL/MongoDB
- Jest for unit testing
- Supertest for API testing
- K6 for load testing

---

## 1. FUNCTIONAL TESTING

### 1.1 Authentication & Authorization

#### Test Case: AUTH-001 - User Registration
```
Priority: High
Module: Authentication
Description: Verify user can register with valid credentials

Preconditions:
- Server is running
- Database is initialized
- No existing user with test email

Steps:
1. Navigate to /auth/register
2. Enter valid email (test@example.com)
3. Enter password (MinLength: 8 chars, 1 uppercase, 1 number)
4. Enter confirm password (matching)
5. Submit form

Expected Result:
- User account created successfully
- Redirect to login page
- Email verification sent
- Response: 201 Created
- Response body includes userId and token

Test Data:
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Test Case: AUTH-002 - Registration Validation
```
Priority: High
Module: Authentication
Description: Verify registration rejects invalid data

Test Cases:
1. Empty email field → Error: "Email required"
2. Invalid email format → Error: "Invalid email format"
3. Password < 8 chars → Error: "Password too short"
4. No uppercase letter → Error: "Password must contain uppercase"
5. Existing email → Error: "Email already registered"
6. Password mismatch → Error: "Passwords do not match"

Expected Result:
- All invalid submissions rejected with 400 Bad Request
- Clear error messages displayed
- No user created
- No email sent
```

#### Test Case: AUTH-003 - Login Success
```
Priority: High
Module: Authentication
Description: Verify user can login with valid credentials

Steps:
1. Submit valid email and password
2. Verify credentials against database
3. Generate JWT token
4. Set secure session cookie

Expected Result:
- Response: 200 OK
- JWT token in response
- Refresh token stored in secure cookie
- User redirected to dashboard
- User state persists across page reloads
```

#### Test Case: AUTH-004 - Login Failure
```
Priority: High
Module: Authentication
Description: Verify login rejects invalid credentials

Test Cases:
1. Wrong password → Error: "Invalid credentials"
2. Non-existent email → Error: "Invalid credentials"
3. Account inactive → Error: "Account suspended"
4. Account locked (5+ failed attempts) → Error: "Account locked"
5. Unverified email → Warning: "Please verify email"

Expected Result:
- All failures: 401 Unauthorized
- Generic error message (security)
- Failed attempt logged
- Account locked after 5 failures
```

#### Test Case: AUTH-005 - JWT Token Validation
```
Priority: High
Module: Authentication
Description: Verify JWT token validation on protected routes

Test Cases:
1. Valid token → Access granted
2. Expired token → 401 Unauthorized
3. Invalid signature → 401 Unauthorized
4. No token provided → 401 Unauthorized
5. Malformed token → 401 Unauthorized

Expected Result:
- Valid tokens grant access
- Invalid/expired tokens rejected
- Error message: "Unauthorized"
```

#### Test Case: AUTH-006 - Role-Based Access Control (RBAC)
```
Priority: High
Module: Authorization
Description: Verify users can only access resources based on role

Roles & Permissions:
- Admin: All access
- Manager: Create, read, edit leads/opportunities
- Sales: Read/edit own records only
- Support: Read customers, create tickets

Test Cases:
1. Admin accesses admin panel → Allowed
2. Sales user accesses admin panel → 403 Forbidden
3. Sales user views own leads → Allowed
4. Sales user views colleague's leads → 403 Forbidden
5. Support user creates lead → 403 Forbidden

Expected Result:
- Access granted/denied based on role
- Consistent with permission matrix
```

---

### 1.2 Customer Management

#### Test Case: CUST-001 - Create Customer
```
Priority: High
Module: Customer Management
Description: Verify customer creation with valid data

Test Data:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp",
  "industry": "Technology",
  "website": "https://example.com",
  "status": "active"
}

Expected Result:
- Response: 201 Created
- Customer ID generated (UUID)
- Timestamp created
- All fields stored correctly
- Searchable immediately
```

#### Test Case: CUST-002 - Validate Required Fields
```
Priority: High
Module: Customer Management
Description: Verify required fields validation

Required Fields:
- firstName
- lastName  
- email

Test Cases:
1. Missing firstName → Error
2. Missing lastName → Error
3. Missing email → Error
4. Invalid email format → Error
5. Duplicate email → Error: "Email already exists"

Expected Result:
- 400 Bad Request
- Clear field-specific error messages
- No customer created
```

#### Test Case: CUST-003 - Read Customer
```
Priority: High
Module: Customer Management
Description: Verify customer retrieval

Test Cases:
1. GET /api/customers/:id (valid ID) → Returns customer
2. GET /api/customers/:id (invalid ID) → 404 Not Found
3. GET /api/customers/:id (unauthorized user) → 403 Forbidden

Expected Result:
- Valid requests return complete customer object
- Invalid ID returns 404
- Unauthorized requests rejected
```

#### Test Case: CUST-004 - Update Customer
```
Priority: High
Module: Customer Management
Description: Verify customer update

Test Cases:
1. Update single field → Allowed
2. Update multiple fields → Allowed
3. Update with validation errors → Rejected
4. Update by unauthorized user → 403 Forbidden
5. Update non-existent customer → 404 Not Found

Expected Result:
- Valid updates reflected immediately
- Updated timestamp changed
- Audit log entry created
- Invalid updates rejected
```

#### Test Case: CUST-005 - Delete Customer
```
Priority: High
Module: Customer Management
Description: Verify customer deletion

Test Cases:
1. Delete by authorized user → Soft delete
2. Delete by unauthorized user → 403 Forbidden
3. Delete non-existent customer → 404 Not Found
4. Retrieve deleted customer → Not visible in normal queries
5. Customer with active opportunities → Warning shown

Expected Result:
- Soft delete implemented (data not destroyed)
- Customer marked as deleted
- Audit log recorded
- Related records maintained
```

#### Test Case: CUST-006 - List Customers with Pagination
```
Priority: High
Module: Customer Management
Description: Verify customer list retrieval with pagination

Test Cases:
1. GET /api/customers (default) → Returns first 20 results
2. GET /api/customers?page=2&limit=10 → Returns page 2, 10 items
3. GET /api/customers?limit=100 → Returns max 100 items
4. GET /api/customers?limit=1000 → Returns max 100 items (capped)

Expected Result:
- Default limit: 20
- Max limit: 100
- Total count provided
- Has next/previous page indicators
```

#### Test Case: CUST-007 - Search Customers
```
Priority: High
Module: Customer Management
Description: Verify customer search functionality

Test Cases:
1. Search by name: "John" → Returns all Johns
2. Search by email: "john@" → Returns matching emails
3. Search by company: "Acme" → Returns Acme employees
4. Search by industry: "Tech" → Returns tech companies
5. Combined filter: name + industry → Returns matched

Expected Result:
- Results returned within 500ms
- Case-insensitive search
- Partial match support
- Relevant results first
```

#### Test Case: CUST-008 - Customer Activity History
```
Priority: High
Module: Customer Management
Description: Verify customer activity log

Test Cases:
1. View customer activity log
2. Log includes: calls, emails, meetings, notes
3. Activity sorted by timestamp (newest first)
4. Each entry shows who, what, when
5. Cannot edit/delete activity log

Expected Result:
- Complete audit trail available
- All interactions logged
- Timestamp accuracy
- Read-only access
```

---

### 1.3 Lead & Opportunity Management

#### Test Case: LEAD-001 - Create Lead
```
Priority: High
Module: Lead Management
Description: Verify lead creation

Test Data:
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex@example.com",
  "company": "Tech Startup",
  "phone": "+1-555-987-6543",
  "stage": "prospecting",
  "source": "website",
  "budget": 50000,
  "timeline": "Q3 2024"
}

Expected Result:
- Response: 201 Created
- Lead ID generated
- Status: "new"
- Source tracked
- Owner assigned (current user)
```

#### Test Case: LEAD-002 - Lead Pipeline Stages
```
Priority: High
Module: Lead Management
Description: Verify lead moves through pipeline stages

Pipeline Stages:
1. Prospecting → Qualified
2. Qualified → Proposal
3. Proposal → Negotiation
4. Negotiation → Won/Lost

Test Cases:
1. Move lead: Prospecting → Qualified → Allowed
2. Move lead: Qualified → Won → Rejected (skip stages)
3. Move lead: Won → Prospecting → Allowed
4. Update stage with timestamp → Recorded
5. Stage change triggers notification

Expected Result:
- Sequential stage movement enforced (if configured)
- Timestamp recorded for each stage
- Notification sent to relevant users
- Audit log entry created
```

#### Test Case: LEAD-003 - Lead Scoring
```
Priority: Medium
Module: Lead Management
Description: Verify lead scoring calculation

Scoring Rules:
- Engagement level: +20 points
- Budget confirmed: +15 points
- Decision maker contact: +10 points
- Website visits: +5 points
- Email opens: +2 points

Test Cases:
1. New lead score = 0
2. Add engagement: score increases
3. Confirm budget: score increases
4. Score displayed on lead card
5. High score leads sorted first

Expected Result:
- Scores calculated automatically
- Updated in real-time
- Visible in lead list
```

#### Test Case: OPP-001 - Create Opportunity
```
Priority: High
Module: Opportunity Management
Description: Verify opportunity creation

Test Data:
{
  "customerId": "uuid",
  "title": "Enterprise Package Deal",
  "amount": 250000,
  "closeDate": "2024-12-31",
  "probability": 75,
  "stage": "proposal",
  "description": "Full enterprise implementation"
}

Expected Result:
- Response: 201 Created
- Opportunity ID generated
- Linked to customer
- Timeline tracked
```

#### Test Case: OPP-002 - Forecast Accuracy
```
Priority: High
Module: Opportunity Management
Description: Verify revenue forecast

Formula: Amount × Probability
Example: $100,000 × 75% = $75,000 weighted

Test Cases:
1. Add opportunity: $100k, 50% prob → Forecast $50k
2. Add opportunity: $50k, 100% prob → Forecast $50k
3. Opportunities sum correctly
4. Forecast updates when opportunity changes

Expected Result:
- Accurate weighted calculations
- Real-time updates
- Exportable forecast
```

---

### 1.4 Task & Activity Management

#### Test Case: TASK-001 - Create Task
```
Priority: High
Module: Task Management
Description: Verify task creation

Test Data:
{
  "title": "Follow up with prospect",
  "description": "Call regarding Q3 requirements",
  "relatedTo": "customerId",
  "assignedTo": "userId",
  "dueDate": "2024-07-15",
  "priority": "high",
  "status": "open"
}

Expected Result:
- Task created successfully
- Notification sent to assigned user
- Task visible in calendar
- Overdue tasks flagged
```

#### Test Case: TASK-002 - Complete Task
```
Priority: High
Module: Task Management
Description: Verify task completion

Test Cases:
1. Mark task complete → Status updated
2. Add completion note → Saved
3. Completion logged in activity
4. Related follow-up created (if configured)
5. Completed task removed from active list

Expected Result:
- Task marked complete
- Timestamp recorded
- Activity log updated
```

#### Test Case: ACTIVITY-001 - Log Activity
```
Priority: High
Module: Activity Management
Description: Verify activity logging (calls, emails, meetings)

Activity Types:
- Call: duration, outcome
- Email: subject, recipients
- Meeting: attendees, notes
- Note: text content

Test Cases:
1. Log call: duration, outcome recorded
2. Log email: subject, recipients stored
3. Log meeting: attendees, location saved
4. Activity linked to customer
5. Activity timestamped

Expected Result:
- All activity types logged
- Linked to relevant records
- Sortable by date/type
```

---

### 1.5 Reporting & Analytics

#### Test Case: REPORT-001 - Dashboard Metrics
```
Priority: High
Module: Reporting
Description: Verify dashboard key metrics

Metrics:
- Total customers
- Active leads
- Open opportunities
- This month's revenue
- Pipeline value
- Conversion rate

Test Cases:
1. Dashboard loads in < 2 seconds
2. Metrics calculate correctly
3. Metrics update when data changes
4. Timezone respected for date calculations

Expected Result:
- Accurate calculations
- Real-time updates
- Performance acceptable
```

#### Test Case: REPORT-002 - Sales Report
```
Priority: High
Module: Reporting
Description: Verify sales performance report

Report Includes:
- Sales by rep
- Sales by product
- Monthly trends
- Pipeline by stage
- Close rate

Test Cases:
1. Generate report for current month
2. Generate report by rep
3. Compare month-to-month
4. Export as PDF/CSV

Expected Result:
- Accurate data aggregation
- Proper date filtering
- Export functionality works
```

#### Test Case: REPORT-003 - Export Data
```
Priority: Medium
Module: Reporting
Description: Verify data export functionality

Formats:
- CSV
- PDF
- Excel (XLSX)

Test Cases:
1. Export customers list as CSV → Correct format
2. Export report as PDF → Formatted correctly
3. Export with filters → Only filtered data
4. Large export (10k+ records) → Handles gracefully

Expected Result:
- All formats work correctly
- File downloads properly
- Data integrity maintained
```

---

## 2. SECURITY TESTING

### 2.1 Authentication Security

#### Test Case: SEC-AUTH-001 - Password Security
```
Priority: Critical
Module: Authentication
Description: Verify password handling security

Test Cases:
1. Passwords hashed using bcrypt (10+ rounds)
2. Password not stored in plain text
3. Password not logged anywhere
4. Password change invalidates all sessions
5. Old password required for change

Expected Result:
- No security vulnerabilities
- Passwords secure
- Sessions invalidated on password change
```

#### Test Case: SEC-AUTH-002 - Session Management
```
Priority: Critical
Module: Authentication
Description: Verify secure session handling

Test Cases:
1. Sessions encrypted
2. Session timeout after 30 min inactivity
3. Cannot reuse expired sessions
4. Session ID randomly generated
5. CSRF token required for state-changing operations

Expected Result:
- Sessions secure
- Timeouts enforced
- CSRF protected
```

### 2.2 Data Protection

#### Test Case: SEC-DATA-001 - SQL Injection Prevention
```
Priority: Critical
Module: Database Security
Description: Verify SQL injection protection

Test Cases:
1. Input: '; DROP TABLE customers; --
2. Input: ' OR '1'='1
3. Input: UNION SELECT * FROM users
4. Input: xp_cmdshell 'dir'

Expected Result:
- All payloads rejected/escaped
- Parameterized queries used
- No database access
```

#### Test Case: SEC-DATA-002 - XSS Prevention
```
Priority: Critical
Module: Frontend Security
Description: Verify Cross-Site Scripting protection

Test Cases:
1. Input: <script>alert('XSS')</script>
2. Input: <img src=x onerror="alert('XSS')">
3. Input: javascript:alert('XSS')
4. Input: <svg onload="alert('XSS')">

Expected Result:
- Scripts not executed
- HTML entities escaped
- Safe content displayed
```

#### Test Case: SEC-DATA-003 - Data Encryption
```
Priority: Critical
Module: Data Security
Description: Verify data encryption in transit and at rest

Test Cases:
1. HTTPS enforced (no HTTP)
2. Sensitive fields encrypted in database
3. API uses TLS 1.2+
4. Certificates valid
5. Sensitive headers not exposed

Expected Result:
- All data encrypted
- No plain text transmission
- Certificates valid
```

### 2.3 Authorization

#### Test Case: SEC-AUTHZ-001 - Privilege Escalation
```
Priority: Critical
Module: Authorization
Description: Verify privilege escalation prevention

Test Cases:
1. User tries to change own role → Fails
2. Regular user tries to access admin APIs → 403
3. Support user tries to access sales reports → 403
4. User tries to modify another user's data → 403

Expected Result:
- No privilege escalation possible
- Strict permission checking
- All attempts logged
```

---

## 3. PERFORMANCE TESTING

### 3.1 Load Testing

#### Test Case: PERF-LOAD-001 - Concurrent Users
```
Priority: High
Module: Performance
Description: Verify system handles concurrent users

Scenario:
- 100 concurrent users
- Each performs: login → view dashboard → list customers
- Duration: 5 minutes

Expected Results:
- Response time < 500ms (p50)
- Response time < 1000ms (p95)
- Response time < 2000ms (p99)
- Error rate < 1%
- CPU usage < 80%
- Memory usage < 85%
```

#### Test Case: PERF-LOAD-002 - Large Dataset
```
Priority: High
Module: Performance
Description: Verify performance with large datasets

Scenario:
- 100,000 customers
- 500,000 activities
- 50,000 leads
- 10,000 opportunities

Test Cases:
1. List customers → Response < 500ms
2. Search customers → Response < 1000ms
3. Get customer details → Response < 200ms
4. Export data (10k records) → Complete < 10s

Expected Results:
- All queries optimized
- Indexes used effectively
- Pagination prevents timeout
```

### 3.2 Stress Testing

#### Test Case: PERF-STRESS-001 - Peak Load
```
Priority: Medium
Module: Performance
Description: Verify system at peak load

Scenario:
- Gradually increase load to 500 users
- Maintain for 10 minutes
- Measure breaking point

Expected Results:
- System remains stable at 500 users
- No data loss
- Recovery within 5 min of load drop
```

---

## 4. USER ACCEPTANCE TESTING (UAT)

### 4.1 Business Process Testing

#### Test Case: UAT-001 - Sales Workflow
```
Priority: High
Module: Overall System
Description: Verify complete sales workflow

Scenario:
1. Sales rep receives lead from website
2. Creates new lead in system
3. Qualifies lead through questions
4. Creates opportunity with estimated value
5. Schedules follow-up call
6. Logs call and moves opportunity forward
7. Generates forecast report

Expected Result:
- Complete workflow functions correctly
- All data captured accurately
- Reports reflect actions
- User satisfaction high
```

---

## 5. TEST EXECUTION

### Test Environment Setup
```bash
# Install dependencies
npm install

# Setup test database
npm run db:test:setup

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run security tests
npm run test:security

# Run performance tests
npm run test:performance

# Generate coverage report
npm run test:coverage
```

### Coverage Requirements
- **Minimum coverage: 80%**
- Critical paths: 100%
- Authentication: 100%
- Authorization: 100%
- Data validation: 100%

---

## 6. BUG SEVERITY LEVELS

| Level | Impact | Example | Fix Time |
|-------|--------|---------|----------|
| Critical | App unusable, data loss, security | SQL injection, authentication bypass | 24h |
| High | Major feature broken | Cannot create customers, reports wrong | 3 days |
| Medium | Feature partially broken, workaround exists | Search slow, export fails | 1 week |
| Low | Minor cosmetic issue | Button text wrong, alignment off | 2 weeks |

---

## 7. SIGN-OFF

**Test Plan Approval:**
- QA Lead: ___________________
- Project Manager: ___________________
- Development Lead: ___________________

**Date:** ___________________

---
