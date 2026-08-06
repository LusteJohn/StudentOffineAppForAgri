const {
  createStudentTutorial,
  getStudentTutorialById,
  getStudentTutorialByUserId,
  listStudentTutorial,
  listStudentTutorialByUser,
  updateStudentTutorial,
  deleteStudentTutorial,
} = require("../models/studentTutorialModel");
const { sendJson } = require("./authController");

function parsePositiveInt(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseBool(value) {
  if (typeof value === "boolean") return value ? 1 : 0;
  const parsed = Number(value);
  return parsed === 1 ? 1 : 0;
}

async function listStudentTutorialHandler(res) {
  const records = await listStudentTutorial();
  return sendJson(res, 200, { data: records });
}

async function listStudentTutorialByUserHandler(req, res, userId) {
  const parsedUserId = parsePositiveInt(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: "Invalid user_id." });
  }

  try {
    const records = await listStudentTutorialByUser(parsedUserId);
    return sendJson(res, 200, { data: records });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : "Unable to load student tutorial.",
    });
  }
}

async function getStudentTutorialByUserHandler(req, res, userId) {
  const parsedUserId = parsePositiveInt(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: "Invalid user_id." });
  }

  try {
    const record = await getStudentTutorialByUserId(parsedUserId);
    if (!record) {
      return sendJson(res, 404, {
        message: "Student tutorial record not found for this user_id.",
      });
    }
    return sendJson(res, 200, { data: record });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : "Unable to load student tutorial.",
    });
  }
}

async function getStudentTutorialByIdHandler(res, tutorialId) {
  const parsedId = parsePositiveInt(tutorialId);
  if (!parsedId) {
    return sendJson(res, 400, { message: "Invalid tutorial_id." });
  }

  const record = await getStudentTutorialById(parsedId);
  if (!record) {
    return sendJson(res, 404, { message: "Student tutorial not found." });
  }

  return sendJson(res, 200, { data: record });
}

async function createStudentTutorialHandler(res, body) {
  try {
    const record = await createStudentTutorial(body);
    return sendJson(res, 201, {
      message: "Student tutorial created successfully.",
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : "Unable to create student tutorial.",
    });
  }
}

async function updateStudentTutorialHandler(res, tutorialId, body) {
  const parsedId = parsePositiveInt(tutorialId);
  if (!parsedId) {
    return sendJson(res, 400, { message: "Invalid tutorial_id." });
  }

  try {
    await updateStudentTutorial(parsedId, body);
    return sendJson(res, 200, {
      message: "Student tutorial updated successfully.",
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : "Unable to update student tutorial.",
    });
  }
}

async function deleteStudentTutorialHandler(res, tutorialId) {
  const parsedId = parsePositiveInt(tutorialId);
  if (!parsedId) {
    return sendJson(res, 400, { message: "Invalid tutorial_id." });
  }

  try {
    const deleted = await deleteStudentTutorial(parsedId);
    if (!deleted) {
      return sendJson(res, 404, { message: "Student tutorial not found." });
    }
    return sendJson(res, 200, {
      message: "Student tutorial deleted successfully.",
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : "Unable to delete student tutorial.",
    });
  }
}

module.exports = {
  listStudentTutorialHandler,
  listStudentTutorialByUserHandler,
  getStudentTutorialByUserHandler,
  getStudentTutorialByIdHandler,
  createStudentTutorialHandler,
  updateStudentTutorialHandler,
  deleteStudentTutorialHandler,
};
