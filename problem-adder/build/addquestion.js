"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./prisma/index"));
const fs_1 = __importDefault(require("fs"));
const MOUNT_PATH = (_a = process.env.MOUNT_PATH) !== null && _a !== void 0 ? _a : "../../boilerplate-generator/problems";
const addQuestion = (problemSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const problemdescription = fs_1.default.readFileSync(`${MOUNT_PATH}/${problemSlug}/Problem.md`, "utf-8");
    const problems = yield index_1.default.problem.upsert({
        where: {
            slug: problemSlug,
        },
        create: {
            slug: problemSlug,
            description: problemdescription,
            hidden: false,
            title: problemSlug,
        },
        update: {
            description: problemdescription,
        },
    });
});
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Please provide the problem slug.");
    process.exit(1);
}
const problemSlug = args[0];
addQuestion(problemSlug)
    .then(() => process.exit(0))
    .catch((err) => {
    console.error("Error adding/updating question:", err);
    process.exit(1);
});
