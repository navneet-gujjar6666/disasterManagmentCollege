# Rescue Team Assignment Setup Guide

## 📋 Overview
This feature allows admins to assign rescue teams from multiple NGOs to disaster relief operations. Rescue teams can have different specializations (medical, search & rescue, logistics, etc.) and availability statuses.

---

## 📁 Files Created & Locations

### **Backend Files** (All in `backend/` folder)

#### 1. **Model**
- **File:** `models/rescueTeam.js`
- **Purpose:** Defines the Rescue Team schema with fields for name, NGO, specialization, equipment, availability, assigned disasters, etc.

#### 2. **Controller**
- **File:** `controllers/rescueTeamController.js`
- **Purpose:** Handles all business logic for:
  - Creating rescue teams
  - Fetching/filtering teams
  - Assigning teams to disasters
  - Unassigning teams from disasters
  - Updating team info
  - Deleting teams

#### 3. **Routes**
- **File:** `routes/rescueTeamRoutes.js`
- **Purpose:** Express routes for rescue team API endpoints
- **Endpoints:**
  - `POST /api/rescue-team` - Create team
  - `GET /api/rescue-team` - Get all teams (with filters)
  - `GET /api/rescue-team/available` - Get available teams for a disaster
  - `GET /api/rescue-team/:id` - Get team by ID
  - `POST /api/rescue-team/assign` - Assign team to disaster
  - `POST /api/rescue-team/unassign` - Remove team from disaster
  - `PUT /api/rescue-team/:id` - Update team
  - `DELETE /api/rescue-team/:id` - Delete team

#### 4. **Updated**
- **File:** `index.js`
- **Change:** Added rescue team routes import and middleware

---

### **Frontend Files** (All in `frontend/src/components/` folder)

#### 1. **Component**
- **File:** `RescueTeamAssignment.js`
- **Purpose:** React admin panel for assigning rescue teams to disasters
- **Features:**
  - Two tabs: "Assign Teams" and "Manage Teams"
  - Select a disaster from cards
  - Filter teams by specialization, availability, NGO name
  - Assign/unassign teams with visual feedback
  - View currently assigned teams
  - Responsive grid layout

#### 2. **Styling**
- **File:** `RescueTeamAssignment.css`
- **Purpose:** Custom CSS matching your project's gradient purple theme
- **Features:**
  - Purple gradient header (matches your existing design)
  - Card-based UI for disasters and teams
  - Responsive grid layout (mobile-friendly)
  - Color-coded availability badges
  - Professional animations and hover effects

---

## 🚀 Installation & Setup Steps

### **Step 1: Ensure Backend is Running**
```powershell
cd "d:\backEnd\namaste node.js\20. disasterManagmentPiyush\natural-disastermanagement\backend"
npm run dev
```
- Verify "server running on port 5000" and "Connected to MongoDB"

### **Step 2: Seed Sample Rescue Teams (Optional)**
Create a seeding script if you want sample data. Run in backend folder:

```powershell
node -e "
const mongoose = require('mongoose');
const RescueTeam = require('./models/rescueTeam');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const teams = [
      {
        name: 'Alpha Medical Team',
        ngoName: 'Red Cross',
        specialization: 'medical',
        memberCount: 15,
        contactPerson: 'Dr. John Smith',
        contactPhone: '555-0001',
        contactEmail: 'alpha@redcross.org',
        experience: 'expert',
        trainingCertifications: ['First Aid', 'Trauma Surgery']
      },
      {
        name: 'Bravo Search & Rescue',
        ngoName: 'Rescue Without Borders',
        specialization: 'search_rescue',
        memberCount: 20,
        contactPerson: 'Maria Garcia',
        contactPhone: '555-0002',
        contactEmail: 'bravo@rwb.org',
        experience: 'expert'
      },
      {
        name: 'Charlie Logistics Unit',
        ngoName: 'World Vision',
        specialization: 'logistics',
        memberCount: 10,
        contactPerson: 'Ahmed Hassan',
        contactPhone: '555-0003',
        contactEmail: 'charlie@worldvision.org',
        experience: 'intermediate'
      }
    ];
    
    await RescueTeam.deleteMany({});
    await RescueTeam.insertMany(teams);
    console.log('✓ Sample teams created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
seed();
"
```

### **Step 3: Verify Frontend Routing**
The files already include the route update. Confirm in `App.js`:
```javascript
import RescueTeamAssignment from './components/RescueTeamAssignment';
// ...
<Route 
  path="/admin/rescue-teams" 
  element={isAuthenticated && isAdmin ? <RescueTeamAssignment /> : <Navigate to="/login" />} 
/>
```

### **Step 4: Start Frontend**
```powershell
cd "d:\backEnd\namaste node.js\20. disasterManagmentPiyush\natural-disastermanagement\frontend"
npm start
```

### **Step 5: Access the Feature**
1. **Login as Admin** (ensure your user has `role: 'admin'`)
2. **Navigate to:** `http://localhost:3000/admin/rescue-teams`
3. You should see the Rescue Team Assignment interface

---

## 💡 How to Use the Feature

### **Assign Teams to a Disaster**
1. Click on a disaster card (left side)
2. Apply filters (NGO name, specialization, availability)
3. Select a rescue team from the results
4. Click **"✅ Assign Team to Disaster"**
5. View the team now appears under "Currently Assigned Teams"

### **Unassign a Team**
1. Select a disaster with assigned teams
2. Click **"Remove"** on any assigned team card
3. Team is unassigned immediately

### **View Team Overview**
1. Switch to **"👥 Manage Teams"** tab
2. See all teams with their assignment count and contact info
3. Filter results as needed

---

## 🗄️ Database Schema

### **RescueTeam Collection**
```javascript
{
  _id: ObjectId,
  name: String,                    // Team name
  ngoName: String,                 // Associated NGO
  specialization: String,          // medical, search_rescue, logistics, communication, etc.
  memberCount: Number,             // Number of members
  contactPerson: String,           // Primary contact
  contactPhone: String,            // Phone number
  contactEmail: String,            // Email address
  location: {
    type: "Point",
    coordinates: [lng, lat],       // GeoJSON format
    city: String,
    state: String,
    country: String
  },
  equipmentList: [                 // Equipment the team has
    {
      name: String,
      quantity: Number,
      description: String
    }
  ],
  availability: String,            // available, busy, unavailable
  assignedDisasters: [ObjectId],   // Array of disaster _id references
  trainingCertifications: [String],// List of certifications
  experience: String,              // beginner, intermediate, expert
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Styling & Theme

The component uses your existing gradient theme:
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Responsive Design:** Works on mobile (cards stack vertically)
- **Color Coding:**
  - 🟢 Available teams
  - 🟡 Busy teams
  - 🔴 Unavailable teams

---

## 🔒 Security & Permissions

- Only users with `role: 'admin'` can access `/admin/rescue-teams`
- All API calls include JWT token authentication
- Admin check is enforced on both frontend and backend

---

## 📌 File Checklist

### Backend
- ✅ `models/rescueTeam.js`
- ✅ `controllers/rescueTeamController.js`
- ✅ `routes/rescueTeamRoutes.js`
- ✅ `index.js` (updated with route)

### Frontend
- ✅ `components/RescueTeamAssignment.js`
- ✅ `components/RescueTeamAssignment.css`
- ✅ `App.js` (updated with import and route)

---

## 🐛 Troubleshooting

### **Teams not showing up?**
1. Check if rescue teams exist in MongoDB (Disasters collection should have data)
2. Verify backend is running on port 5000
3. Check browser console for API errors
4. Try seeding sample teams using the command above

### **Can't assign teams?**
1. Ensure you're logged in as an admin
2. Select both a disaster AND a team before clicking assign
3. Check if the team is already assigned (no duplicates allowed)
4. Look at browser console for error messages

### **Styling looks off?**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend server (Ctrl+C, then `npm start`)
3. Ensure CSS file is in the same folder as JS component

---

## 📱 Responsive Behavior

- **Desktop:** Cards in grid layout, side-by-side teams and disasters
- **Tablet:** 2-column grid
- **Mobile:** Single-column, full-width cards

---

## 🔄 Future Enhancements

Possible additions:
1. **Team Performance Metrics:** Track successful assignments
2. **Communication System:** Direct messaging with assigned teams
3. **Equipment Tracking:** Monitor team equipment in real-time
4. **Team Rating System:** Rate teams after disaster completion
5. **Automated Assignment:** AI-based team suggestion based on disaster type

---

## 📞 Support

If you encounter issues:
1. Check the browser DevTools console for errors
2. Verify MongoDB connection in backend logs
3. Ensure `.env` file has `MONGODB_URI` set
4. Confirm all files are in correct locations (see "Files Created & Locations" above)

---

**Setup Complete! 🎉 Your admin panel is ready to assign rescue teams to disasters.**
