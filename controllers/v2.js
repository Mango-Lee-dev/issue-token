const jwt = require("jsonwebtoken");
const { User, Domain, Post, Hashtag } = require("../models");

exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: {
        clientSecret,
      },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
      ],
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
        issuer: "nodebird",
      },
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};

exports.getMyPosts = (req, res) => {
  Post.findAll({
    where: { userId: res.locals.decoded.id },
  })
    .then((posts) => {
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    });
};

exports.getHashtagPosts = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: req.params.title },
    });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "존재하지 않는 해시태그입니다.",
      });
    }
    const posts = await hashtag.getPosts({
      where: { userId: res.locals.decoded.id },
    });

    if (!posts) {
      return res.status(404).json({
        code: 404,
        message: "게시글이 존재하지 않습니다.",
      });
    }
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};
