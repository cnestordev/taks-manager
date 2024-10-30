const { default: mongoose } = require('mongoose');
const Team = require('../models/Team');
const User = require('../models/User');
const generateInviteCode = require("../util/inviteCode");

// Team Creation Handler
exports.createTeam = async (req, res) => {
    const { teamName } = req.body;
    const userId = req.user._id;

    if (!teamName) {
        return res.status(400).json(createResponse(400, 'Team name is required'));
    }

    try {
        // Check if the user already belongs to a team
        const user = await User.findById(userId);
        if (user.team) {
            return res.status(400).json({
                error: "User already belongs to a team. A user can only create or belong to one team."
            });
        }

        // Check if a team with the same name already exists
        const existingTeam = await Team.findOne({ name: teamName });
        if (existingTeam) {
            return res.status(400).json(createResponse(400, 'Team name already exists'));
        }

        // Create the team
        const newTeam = new Team({
            name: teamName,
            createdBy: userId,
            members: [userId],
            inviteCode: generateInviteCode()
        });
        await newTeam.save();

        // Link the team to the user and fetch updated user with team populated
        user.team = newTeam._id;
        await user.save();
        const updatedUser = await User.findById(userId).populate('team', 'name inviteCode createdBy members _id');

        return res.status(201).json({
            message: "Team created successfully",
            team: {
                id: newTeam._id,
                name: newTeam.name,
                inviteCode: newTeam.inviteCode,
                createdBy: userId,
                members: [userId]
            },
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                _id: updatedUser._id
            }
        });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ error: "An error occurred while creating the team" });
    }
};

// Get team details
exports.getTeamDetails = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Find the user's team by populated members
        const user = await User.findById(req.user._id).populate('team');
        if (!user.team) {
            return res.status(404).json({ error: 'User does not belong to a team' });
        }

        const team = await Team.findById(user.team._id).populate('members', 'username');
        return res.status(200).json({
            id: team._id,
            name: team.name,
            inviteCode: team.inviteCode,
            createdBy: team.createdBy,
            members: team.members.map(member => ({
                _id: member._id,
                username: member.username
            })),
        });
    } catch (error) {
        console.error('Error retrieving team details:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving team details' });
    }
};

// Remove a team member
exports.removeMember = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const userId = req.user._id;
        const { memberId } = req.body;

        // Find the team that includes the member to be removed
        const team = await Team.findOne({ members: memberId });
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Check if the user is the team admin or the member themselves
        const isAdmin = team.createdBy.toString() === userId.toString();
        const isSelfRemoval = userId.toString() === memberId;

        if (!isAdmin && !isSelfRemoval) {
            return res.status(403).json({ error: 'Only the team admin or the member themselves can remove this member' });
        }

        // Ensure the member to be removed exists in the team
        if (!team.members.includes(memberId)) {
            return res.status(404).json({ error: 'Member not found in the team' });
        }

        // If the admin is removing themselves, remove all members and delete the team
        if (isAdmin && isSelfRemoval) {
            // Clear the `team` field from all members in the team
            await User.updateMany({ team: team._id }, { $set: { team: null } });

            // Delete the team
            await Team.findByIdAndDelete(team._id);
            return res.status(200).json({ message: 'Admin removed themselves; team and all members removed successfully', team: null });
        }

        // Regular member removal case
        team.members = team.members.filter(member => member.toString() !== memberId);
        await team.save();

        // Unlink the team from the removed member's profile
        await User.findByIdAndUpdate(memberId, { team: null });

        // Check if the team has no more members and delete if necessary
        if (team.members.length === 0) {
            await Team.findByIdAndDelete(team._id);
            return res.status(200).json({ message: 'Member removed and team deleted as it has no more members' });
        }

        return res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing team member:', error);
        return res.status(500).json({ error: 'An error occurred while removing the member' });
    }
};

// Join a team using an invite code
exports.joinTeam = async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    if (!inviteCode) {
        return res.status(400).json({ error: 'Invite code is required' });
    }

    try {
        // Check if the user is already in a team
        const user = await User.findById(userId);
        if (user.team) {
            return res.status(400).json({ error: 'User already belongs to a team' });
        }

        // Find the team by invite code
        const team = await Team.findOne({ inviteCode });
        if (!team) {
            return res.status(404).json({ error: 'Invalid invite code' });
        }

        // Add the user to the team's members
        team.members.push(userId);
        await team.save();

        // Update the user's team reference
        user.team = team._id;
        await user.save();

        // Fetch the updated user data with the populated team field
        const updatedUser = await User.findById(userId).populate('team', 'name inviteCode createdBy members _id');

        return res.status(200).json({
            message: 'Successfully joined the team',
            team: {
                id: team._id,
                name: team.name,
                inviteCode: team.inviteCode,
                createdBy: team.createdBy,
                members: team.members,
            },
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                _id: updatedUser._id,
            }
        });
    } catch (error) {
        console.error('Error joining team:', error);
        return res.status(500).json({ error: 'An error occurred while attempting to join the team' });
    }
};