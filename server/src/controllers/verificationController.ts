import {
  AuthTokenFindException,
  findAuthToken,
} from "@/services/authTokenService";
import { findUserById, UserFindException } from "@/services/userService";
import {
  verifyArticleSubtitleFormat,
  verifyArticleTitleFormat,
  verifyCategoryNameFormat,
  verifyUserNameFormat,
  verifyUserPasswordFormat,
} from "@/services/verificationService";
import { RequestHandler } from "express";

export const authTokenVerificationController: RequestHandler = async (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  try {
    if (await findAuthToken(value)) {
      res.status(200).json({
        exists: true,
      });
      return;
    }
    res.status(200).json({
      exists: false,
    });
  } catch (error) {
    if (error instanceof AuthTokenFindException) {
      res.status(200).json({
        exists: false,
      });
      return;
    }
    throw error;
  }
};

export const userIdVerificationController: RequestHandler = async (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  try {
    if (await findUserById(value)) {
      res.status(200).json({
        valid: true,
        errorCode: null,
        exists: true,
      });
      return;
    }
    res.status(200).json({
      valid: true,
      errorCode: null,
      exists: false,
    });
  } catch (error) {
    if (error instanceof UserFindException) {
      res.status(200).json({
        valid: false,
        errorCode: error.errorCode,
        exists: false,
      });
      return;
    }
    throw error;
  }
};

export const userPasswordVerificationController: RequestHandler = (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  const verificationResult = verifyUserPasswordFormat(value);
  if (verificationResult.error) {
    res.status(200).json({
      valid: false,
      errorCode: verificationResult.errorCode,
    });
    return;
  }
  res.status(200).json({
    valid: true,
    errorCode: null,
  });
};

export const userNameVerificationController: RequestHandler = (req, res) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  const verificationResult = verifyUserNameFormat(value);
  if (verificationResult.error) {
    res.status(200).json({
      valid: false,
      errorCode: verificationResult.errorCode,
    });
    return;
  }
  res.status(200).json({
    valid: true,
    errorCode: null,
  });
};

export const categoryNameVerificationController: RequestHandler = (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  const verificationResult = verifyCategoryNameFormat(value);
  if (verificationResult.error) {
    res.status(200).json({
      valid: false,
      errorCode: verificationResult.errorCode,
    });
    return;
  }
  res.status(200).json({
    valid: true,
    errorCode: null,
  });
};

export const articleTitleVerificationController: RequestHandler = (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  const verificationResult = verifyArticleTitleFormat(value);
  if (verificationResult.error) {
    res.status(200).json({
      valid: false,
      errorCode: verificationResult.errorCode,
    });
    return;
  }
  res.status(200).json({
    valid: true,
    errorCode: null,
  });
};

export const articleSubtitleVerificationController: RequestHandler = (
  req,
  res
) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).end();
    return;
  }

  const verificationResult = verifyArticleSubtitleFormat(value);
  if (verificationResult.error) {
    res.status(200).json({
      valid: false,
      errorCode: verificationResult.errorCode,
    });
    return;
  }
  res.status(200).json({
    valid: true,
    errorCode: null,
  });
};
