/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

/**
 * @import {Config} from "eslint/config"
 */

import { createESLintPackageConfig } from "@sister.software/eslint-config"

import { defineConfig } from "eslint/config"

// @ts-check

/**
 * @type {Config[]}
 */
const eslintConfig = defineConfig(
	createESLintPackageConfig({
		spdxLicenseIdentifier: "AGPL-3.0",
		parserOptions: {
			tsconfigRootDir: import.meta.dirname,
		},
	})
)

export default eslintConfig
