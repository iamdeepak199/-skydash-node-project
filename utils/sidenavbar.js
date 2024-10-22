function generateSidebar() {
    return `
      <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link" href="/dashboard">
              <i class="icon-grid menu-icon"></i>
              <span class="menu-title">Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/profile">
              <i class="fa fa-key menu-icon"></i>
              <span class="menu-title">Change Password</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
              <i class="icon-columns menu-icon"></i>
              <span class="menu-title">User's Details</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="form-elements">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"><a class="nav-link" href="./userdata">All USERS</a></li>
                <li class="nav-item"><a class="nav-link" href="./allot_particle">Allot Particle</a></li>
                <li class="nav-item"><a class="nav-link" href="./transaction_details">All Transaction</a></li>
                <li class="nav-item"><a class="nav-link" href="./total_business_show">Total Business Show</a></li>
                <li class="nav-item"><a class="nav-link" href="./Service_tax">CA Service Tax Setup</a></li>
                <li class="nav-item"><a class="nav-link" href="./Purchase_setup">CA Purchase Setup</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#charts" aria-expanded="false" aria-controls="charts">
              <i class="icon-bar-graph menu-icon"></i>
              <span class="menu-title">check Payout</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="charts">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="./Level_Details">Level</a></li>
                <li class="nav-item"> <a class="nav-link" href="./consultation_income">Consultation Income</a></li>
                <li class="nav-item"> <a class="nav-link" href="./rank_payout">Royalty Payments</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Royalty_Achievers">Royalty Achievers</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Rewards_check">Reward Achievers</a></li>
                <li class="nav-item"> <a class="nav-link" href="./reward_claim">Reward Report</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#tables" aria-expanded="false" aria-controls="tables">
              <i class="icon-grid-2 menu-icon"></i>
              <span class="menu-title">Rental Management</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="tables">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="./Rental_Manager">Rental Manager</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Rent_Report">Rent Report</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Rent_Bulk">Rent Bulk</a></li>
                <li class="nav-item"> <a class="nav-link" href="./New_Rent_Export">New Rent Export</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Rent_Bulk_Together">Rent Bulk Together</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Approve_Rental">Approve Rental All</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Block_Rent">Block Rent</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Resume_Rent">Resume Rent</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#icons" aria-expanded="false" aria-controls="icons">
              <i class="icon-contract menu-icon"></i>
              <span class="menu-title">Fragment Management</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="icons">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="./users_activate">Real Active</a></li>
                <li class="nav-item"> <a class="nav-link" href="./fake_activate">Fake Active</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
              <i class="icon-head menu-icon"></i>
              <span class="menu-title">Withdrawal</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="auth">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="./Withdrawal_Request">Withdrawal Request</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Bulk_Approval">Bulk Approval</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Withdrawal_Report">Withdrawal Report</a></li>
                <li class="nav-item"> <a class="nav-link" href="./New_list">New List</a></li>
                <li class="nav-item"> <a class="nav-link" href="./New_Export">New Export</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Bulk_withdarwal_list">Bulk Withdrawal List</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#error" aria-expanded="false" aria-controls="error">
              <i class="icon-ban menu-icon"></i>
              <span class="menu-title">Support</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="error">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="./Ticket_request">Ticket Request</a></li>
                <li class="nav-item"> <a class="nav-link" href="./Ticket_reply">Ticket Reply</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="./popup_news">
              <i class="icon-paper menu-icon"></i>
              <span class="menu-title">Add Popup/News</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/login">
              <i class="fa fa-sign-out"></i> Logout
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
  
  module.exports = generateSidebar;
  