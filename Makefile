# Carters Portfolio Root Makefile
# 2025 | ©AngelaMos |

.DEFAULT_GOAL := help
MAKEFLAGS += --no-print-directory

DEV_COMPOSE_FILE := docker-compose.yml.dev
PROD_COMPOSE_FILE := docker-compose.yml.prod

FRONTEND_DIR := frontend

.PHONY: help logs frontend-logs backend-logs nginx-logs build-dev dev dev-up dev-down \
	clean-docker nuke-docker format check scss scss-fix lint types lint-full \
	dev-logs dev-backend-logs dev-frontend-logs dev-nginx-logs \
	prod prod-up prod-down prod-logs prod-backend-logs prod-nginx-logs

define ASCII_DOCKER
	@echo "\033[96m"
	@echo " ⠀⠀⠀⠀⠀⠴⣦⣤⡀⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⣨⣥⣄⣀⠀⡁⠀⠀⡀⡠⠀⠀⠀⠂⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⢠⣾⣿⣷⣮⣷⡦⠥⠈⡶⠮⣤⣀⡠⠀⡀⣐⣀⡈⠁⠀⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⠟⠀⠠⠊⠉⠀⠀⢀⠉⠙⠚⠧⣦⣀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠠⠀⠁⠀⢤⠀⠀⠀⠨⡉⠛⠶⠤⣄⣄⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⡀⠀⠀⢰⠀⠍⡾⠆⠀⠀⣠⡦⠄⡀⠄⠀⠠⠀⠀⠀⠈⠙⠓⠦⢤⣀⡀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣶⣦⢠⡈⠀⠀⠀⠀⠀⠋⠛⠉⡂⠈⠙⠀⣰⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠺⠦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⣾⣿⣿⣦⢤⡀⢀⣂⣨⠀⢅⢱⡔⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠲⠴⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣎⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣾⣽⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⠳⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠏⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠹⣦⣴⠖⠲⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠈⠀⠀⠀⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢩⠢⣙⠿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣆⠈⠛⢶⣌⡉⣻⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣷⣄⣤⣙⣿⣿⣿⣷⣄⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠟⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡿⣿⣿⣿⣿⣿⣿⡿⠋⠉⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠙⠁⠘⢮⣛⡽⠛⠿⡿⠥⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢀⣐⣀⡀⠈⠀⠠⠀⠈⠈⠀⠀⠂⠀⠀⠀⠀⠁⢀⠀⠀⠀⠀⠐⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⢀⣴⣷⣬⣝⠻⣦⡄⠀⠠⢀⣀⠢⣀⡀⠀⠀⠀⢀⡠⠈⠀⠀⠀⠀⣠⣾⠏⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⣴⣿⣿⣿⣿⣿⣷⡘⣿⣤⣾⣿⣿⣿⡿⠟⠛⠙⠻⣿⣿⣷⣶⣶⠶⢿⣛⣥⣾⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⢀⣾⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⠈⠙⠻⢿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣾⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠋⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠙⠿⠿⠟⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣷⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣷⣦⡀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣶⣄⡀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⣦⡀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠋⠁ "
	@echo "\033[0m"
endef

define ASCII_BUILD
	@echo "\033[93m"
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⠁⠀⢠⠎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⢀⡿⠀⢀⢤⡎⠀⠀⢀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠀⣼⣿⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⡜⡌⠀⠀⠀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠀⣰⠁⢿⡈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠇⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢀⣼⡟⠀⢀⠟⠃⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⢀⡞⠀⣼⠁⢰⠃⠀⠘⣧⣇⠀⠀⠀⠀⠀⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣀⡀⠀⠀⠀⢸⡗⡇⠀⣼⠀⠀⠀⢰⡇⠀⠀⠀⠀⠀⠀⠀⡼⠀⣼⡏⢀⡏⠀⠀⠀⢻⣿⠀⠀⠀⠀⡇⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣇⠀⠀⣼⢀⠁⢰⡏⠀⠀⠀⣾⠇⠀⠀⠀⠀⠀⠀⣸⠃⣰⣿⠃⣼⣦⣤⣀⡀⠈⣿⡄⠀⠀⠀⡇⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣦⣺⠇⢸⡀⣿⣧⠀⠀⢸⣿⠀⣤⠀⠀⠀⠀⢰⡿⢠⣿⣿⢰⡇⠀⠀⠉⠉⠓⠾⣧⠀⠀⠀⠇⠀⡸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⣿⣶⣾⣿⣿⣿⡆⠀⣾⣿⡀⣧⡀⠀⠀⠀⣿⣧⣾⣿⣿⣾⣿⣾⣿⣿⣷⣆⠀⢻⡆⠀⠀⢰⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⣿⢁⣿⣿⠿⣿⣿⣄⡿⢹⣿⣿⣷⣄⡀⢸⡟⣽⣿⣿⣿⡟⠛⢻⣿⣿⣿⣟⣿⣾⣷⠀⠀⢸⡈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⡏⣸⣿⣿⣶⠿⣿⣿⡇⠀⢿⠛⢿⣿⣿⡿⠀⢹⣿⠟⠉⠃⠀⣨⣭⣿⣿⣿⣿⣿⣿⡆⠀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⠇⣿⣿⣿⠿⠚⠁⠈⠁⠀⠀⠀⠀⠀⠉⠁⠀⠀⠻⣦⣄⣀⣀⢿⡟⠉⠙⣻⣿⣞⣻⣿⡀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⢰⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⢸⣷⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⣸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀ "
	@echo " ⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⡿⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀ "
	@echo " ⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠀⣿ "
	@echo " ⣿⣿⣿⣿⡟⣧⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣇⣼⠟ "
	@echo " ⣿⣿⣿⣿⣷⣸⡟⠛⠻⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⣧⠟⠋⠁⢀ "
	@echo " ⣿⣿⣿⣿⣿⡍⢳⡀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⠀⡠⠔⠁ "
	@echo " ⣿⣿⣿⣿⣿⣷⣴⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡏⠀⢀⠀ "
	@echo " ⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠀⠀⡌⠀ "
	@echo " ⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡏⠀⠀⡇⠀ "
	@echo " ⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣤⣴⠖⠛⠉⠁⠀⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⡇⠀ "
	@echo " ⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣦⣤⣴⣶⣶⣶⣶⣶⡟⣋⣹⣿⣿⣿⡍⠀⠀⠀⠀⠀⠀⢀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠃⠀⢸⡇⠀ "
	@echo "\033[0m"
endef

define ASCII_LOGS
	@echo "\033[95m"
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡷⡀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⠺⣟⡽⠀⠀⠀⠀⠀⠀⠀⠈⠑⠂⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠊⠁⠀⠀⠙⠁⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠀⠈⠳⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⠀⢠⠎⠀⠀⠆⠀⢰⡃⠀⠐⡄⠀⢲⠀⠃⢻⠀⠀⠀⡄⠀⠀⠈⠱⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠸⣶⣄⣺⢇⡄⠀⡇⠀⢰⢺⠱⣄⠀⠘⢆⠈⡆⠀⠸⠀⠀⠀⡇⠀⠀⠀⠰⠘⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠙⢿⡏⢸⠀⠀⡇⠀⢸⣾⢀⣨⣷⡄⠈⢣⣇⠀⠀⡆⠀⠀⡇⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢸⠃⢸⡄⢸⡇⡀⢸⢿⡏⠀⣀⣹⣦⡀⢿⠀⠀⡇⠀⠀⡇⠀⠀⠀⠀⠀⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⣼⡄⠈⡇⠈⣿⣿⣼⣞⣷⠾⣿⣿⡿⠉⢻⠀⠀⡇⠀⠀⡿⠟⢷⡄⠀⠀⠀⡘⡄⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⡇⣇⢸⢿⡀⠇⠻⠉⠸⠏⣠⠟⠉⠀⠀⠀⡄⠀⠿⠀⠀⣿⡀⠀⡇⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⣿⣿⣾⣷⣧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⢀⡿⢃⣼⠁⠀⠀⠃⠀⢸⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢻⡻⢯⣻⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⢸⡧⡎⢸⠃⠀⠀⢠⢀⣸⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢸⡇⢸⠉⠧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⢸⡇⡇⢸⠀⠀⠀⢸⡈⣿⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⢸⠃⢸⡀⠀⠀⠀⢀⡠⠴⠚⠀⠀⠀⠀⠀⢸⠀⠀⠀⢸⡇⢸⢸⡀⠀⠀⠈⡇⢻⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠘⡆⠀⢇⠀⠀⠰⠋⠀⠀⠀⠀⠀⠀⠀⠀⢨⠀⠀⠀⢸⠃⠈⡇⡇⠀⠀⠀⢱⢸⠀⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⣿⠀⠈⢢⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠍⠀⠀⠀⣿⠀⠀⢡⠱⠀⠀⠀⠸⡜⡇⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⣽⢆⠀⠀⠀⠀⠀⣠⠒⠁⠉⢀⡆⠀⠀⣿⡄⠀⠸⡄⠀⠀⠀⠀⢇⠇⠀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⢸⡄⠀⠀⣿⠀⠓⠤⠔⠒⠻⡇⢀⡴⠚⠉⡇⠀⠀⡧⢇⠀⠀⢱⡀⠀⠀⠀⠘⣾⡀⠀⠀⠀⠀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⢸⡆⠀⢰⣿⡄⡆⠀⠀⠀⠀⢷⠋⠀⠀⠀⡇⠀⢀⠁⢈⠷⢶⣤⡷⣤⣤⢤⡤⠞⠓⠒⠦⢄⡀⠀ "
	@echo " ⠀⠀⠀⠀⠀⠀⢸⠀⠀⢸⡇⡇⢁⠀⠀⠀⢀⢻⠀⠀⠀⠀⡇⠀⢸⠀⠣⢤⣀⣞⡏⠉⡱⠋⠀⠀⠀⠀⠀⠀⠙⡆ "
	@echo " ⠀⠀⠀⠀⠀⠀⢸⠀⠀⡞⠀⢡⢸⡀⠀⣀⡼⠀⢳⠀⠀⠀⡇⠀⡏⠀⢀⣾⣿⣾⣟⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻ "
	@echo " ⠀⠀⠀⠀⠀⠀⢸⠀⢠⠇⠀⠈⢇⡷⣺⢿⠏⡞⠑⠚⠉⢀⠀⢠⠁⣠⣿⣿⣻⣟⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿ "
	@echo " ⠀⠀⠀⠀⠀⠀⣿⠀⡘⢀⣠⠞⣉⠵⣡⠏⠀⢧⠀⠀⠀⣸⠀⣾⣼⣉⣉⣍⡿⡝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸ "
	@echo " ⠀⠀⠀⠀⢀⣴⡿⢠⠏⣉⣵⠞⠁⡰⡃⠀⠀⢘⡤⠴⢒⠇⢠⣿⡀⣉⣴⣿⣿⡁⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹ "
	@echo " ⠀⠀⠀⢀⠎⢸⡇⣸⣾⣿⣿⣀⣴⢱⣇⡤⠚⠁⢀⠀⣼⠄⡿⠋⠉⠁⢸⡛⢿⠑⢤⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸ "
	@echo " ⠀⠀⠀⡞⢀⣎⢧⣟⣿⡿⠋⠀⠀⠉⠁⠀⣠⣾⠟⣸⡟⢸⠁⠀⠀⠀⠸⡇⢸⡄⢸⠃⠀⢀⣠⠤⠤⠤⠔⠢⡀⣸ "
	@echo " ⠀⠀⣸⠀⡸⢸⡟⣶⡿⠁⠀⠀⠀⠀⠀⠀⠉⠀⢠⣿⠀⡞⠀⠀⠀⠀⡇⣿⠸⣿⣾⠀⠀⠀⠙⠒⠒⠲⣌⣠⢌⣻ "
	@echo " ⠀⠀⡏⠀⣇⠞⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢿⢻⠀⡇⠀⠀⠀⠀⣷⡇⠀⢻⢹⡄⠀⠀⠀⠀⠀⠀⠈⠁⠀⣼ "
	@echo " ⠀⢰⢀⡜⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢸⣞⡄⡇⠀⠀⠀⠀⡿⡇⠀⠸⡆⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟ "
	@echo " ⠀⡞⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣄⠀⢸⢸⠛⠙⠻⠀⠀⠀⠀⢣⡇⠀⠀⡇⢡⠀⠀⠀⠀⠀⡀⠀⠀⠀⡇ "
	@echo " ⠀⢳⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⡿⠀⠀⡞⡀⠀⠀⠀⠀⠀⠀⠘⡾⡄⠀⡇⢸⠀⠀⠀⠀⡼⠁⠀⠀⢠⠃ "
	@echo " ⢸⢸⠀⣾⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣇⠀⠀⠀⠀⠀⠀⠀⠘⣿⣆⡇⡆⠀⠀⣀⡜⠁⠀⠀⠀⢸⡆ "
	@echo "\033[0m"
endef

define ASCII_LINT
	@echo "\033[95m"
	@echo " ⠀⠀⠀⠀⢠⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠈⡷⠛⣵⣶⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡀⢸⡏⣒⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⢀⣹⣵⢿⢿⣿⣟⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⡽⢋⠶⠒⠁⠀⠀⠀⠸⣟⣄⠈⠙⠰⡠⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⢨⣽⣿⣿⣾⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠒⣷⠁⠀⠀⠀⠀⠀⡠⣤⠴⠛⣏⢂⠀⠈⠑⠅⡂⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠹⠟⢿⡏⢉⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇⣰⠁⡐⠶⡀⠀⠀⠀⠀⠬⣻⣮⣾⢠⢣⠐⡀⠀⠀⠣⢌⡂⡄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢏⡜⣇⠂⢰⠀⢻⣕⠢⣤⣄⣦⣱⣿⡟⠀⢨⢣⡈⢆⠀⠀⠄⠈⠑⠀⢳⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⢴⢏⡎⠴⣹⣆⣿⣿⣌⣎⡙⠛⠿⠟⣿⣿⠧⣠⡾⢏⡻⣦⣁⠑⢆⠀⠠⠀⠀⡀⠑⠣⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢿⣿⣿⣧⠀⠀⠀⠀⠀⣠⠞⣭⠞⣨⠱⣸⠏⢾⡙⡯⣉⠡⢄⡄⣠⡟⣟⣰⣿⣻⣷⣥⡙⣯⣗⠦⡑⢄⠐⢀⠀⠀⠠⡐⠌⡁⢢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡵⠩⢚⣻⣿⣯⠀⢀⡤⠺⢁⣾⢃⡞⡤⣣⠏⠈⠀⢉⠙⠂⢄⣮⡿⠇⠃⢁⡞⠻⣷⣯⣿⣻⢦⡻⢿⣶⢥⣓⣄⠑⣄⢑⠈⢄⠈⠦⡈⠓⠠⡀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠡⡀⠛⣽⣽⣿⣶⠋⢀⣴⡟⣎⠓⡾⣳⠋⠀⣠⣔⡁⢀⣶⠏⢺⣾⣤⢴⠁⡇⠀⠀⢹⣿⣽⣯⢟⣮⡙⢷⣯⡲⢷⡈⢢⡨⢄⠁⡉⢂⠑⢆⠈⡢⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢄⠙⣿⣿⣿⣦⣾⡹⠵⣉⣖⡵⠋⣠⣶⣿⣿⣗⠊⠉⠠⢪⣋⣉⢸⠀⡥⢶⠶⠼⣿⣿⣿⣾⣯⣷⡾⣿⠓⢬⠳⡌⢧⠈⢆⢃⠘⡆⠨⡒⢅⢔⢄⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠶⠫⢲⣿⣿⣿⣿⣿⢿⡷⣿⣎⣵⣾⢿⣻⣿⠿⣇⠁⡴⢁⠇⠀⢀⡟⢠⢡⠂⠀⠀⠀⠉⠙⠻⣿⣿⣿⣿⠀⠈⠳⡘⡌⡗⡈⢆⠂⠸⡐⣡⢄⠳⡡⡢⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⣠⢞⠍⢀⣁⠴⣺⣇⣿⣿⣿⣿⣿⣾⣵⣯⣿⣿⣿⠟⠝⢀⠀⡜⢀⡎⠴⠭⣽⡇⢸⠁⠀⠀⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡰⠱⡹⠘⡄⠀⢣⠀⢣⠡⡙⣄⠱⡀⠀ " 
	@echo " ⠀⠀⠀⠀⣠⡾⢕⢅⡰⣻⢌⡣⢿⣯⣿⣿⣿⣿⣿⡿⠿⠿⠿⠟⢁⠊⣠⢏⡜⠀⣼⠀⠀⠇⣼⠁⡀⠀⠀⢰⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢷⢡⢃⡃⠅⡀⢸⠀⡈⣇⠀⢸⡎⠡⠀ " 
	@echo " ⠀⠀⢀⣾⢏⡾⢣⠟⡼⣱⣮⡕⢻⠿⣻⣿⣿⣿⣿⣿⡀⠀⠀⣠⢃⡜⡍⢠⠁⢸⣇⣒⠮⡷⣥⠀⡇⠀⠀⢸⣇⣆⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⢿⣻⢄⢣⠂⡥⠀⢸⡆⠐⡻⡄⠆⢻⠌⡃ " 
	@echo " ⠀⢠⡾⢁⢮⡱⠫⡵⣜⣵⡻⢌⠧⣿⢣⣿⠁⢿⣿⣿⣻⡄⡴⣥⠏⣀⠇⣸⡆⠇⡇⠀⠘⢀⡇⢠⡁⠀⠀⠈⣟⢻⣦⣄⡀⠀⠀⢀⣀⣴⡾⣏⡻⣏⢎⢆⠳⢤⠀⣟⡀⡔⡐⣧⠀⠨⣇⠹ " 
	@echo " ⢀⡞⠀⡜⣼⢁⣟⢿⣽⢯⢗⠿⣼⠏⣿⣿⠀⠈⣿⣿⣿⣿⣾⡇⠉⢧⢣⡆⠀⠀⢱⢀⠇⣸⠁⣼⣱⣀⠀⠀⠘⢆⢩⣛⠿⠿⣿⢟⣣⢟⣹⠞⡱⣎⠯⣌⠎⠅⡼⣣⢀⡅⠜⣿⠤⠀⣯⠀ " 
	@echo " ⢸⠁⠀⣧⠄⡼⣾⣻⡽⢃⡞⡠⣝⡏⢾⣿⡀⠀⠸⣿⣿⣿⣿⡟⣶⡠⣼⡇⠀⠀⠘⣆⢴⣛⠭⢷⣠⣶⣾⣄⠀⠀⠑⠼⣌⠹⡁⠞⣔⢫⣞⣽⡻⣭⢷⣎⡮⢾⣱⣧⢞⡶⢹⣼⠂⡀⣷⠀ " 
	@echo " ⠀⠀⠀⢿⠀⣱⣏⣿⢒⡏⣇⡳⢸⣽⡚⣇⢣⠀⠀⡿⣿⢿⣻⣽⣆⣹⢿⠷⢤⡲⠝⠋⠁⠀⢰⣿⠯⣷⣯⣿⣶⠄⡂⠤⣤⣭⣯⠷⣞⣷⣾⢧⢟⡎⠲⢌⡗⣌⡾⣈⢫⣟⣼⣿⢡⢐⣯⠄ " 
	@echo " ⠀⠀⠀⢸⠀⣸⠇⣯⢸⢸⡅⢳⡻⢿⢿⢹⡀⠣⡀⢇⢹⣿⣿⣿⠿⡋⠀⠉⠁⠀⠀⠀⠀⢠⡿⠿⡿⠛⣫⣤⣎⠀⠀⠉⠙⠛⠛⠛⢛⣿⢋⣯⡞⡸⣑⢮⣜⣼⠳⣠⡿⣿⣿⠏⡆⣞⣧⡆ " 
	@echo " ⠠⠀⠀⠘⡇⣼⣯⣇⢻⣘⡎⢍⢷⣜⡻⣶⣳⠀⢀⢸⠛⠻⣚⠈⠛⠼⡄⣀⣬⠶⡬⠀⢡⡿⢧⡤⡯⢍⠀⢹⣿⣇⠀⠀⠀⣀⡤⢾⠟⣃⣯⢏⡴⡕⣫⢾⣟⣯⡿⢿⣳⠏⣿⡾⣼⢫⡟⠀ " 
	@echo " ⠀⢂⠀⠀⢷⢏⡟⣸⣹⢞⣿⣀⡈⢳⡽⢷⡿⠟⠊⠁⠀⠀⢻⣇⡄⣀⣩⣵⠁⡰⠁⠀⢇⢹⣄⠈⠓⣿⣬⣯⣺⠋⠀⠀⠀⡠⠔⣡⣬⠟⣩⣿⢿⣫⣞⡧⠟⠉⣠⡿⠁⣸⡿⡷⢃⡞⠀⠀ " 
	@echo " ⠀⠀⠑⠠⢈⡟⣧⠹⢾⠿⣶⣇⡽⠛⠈⠁⠀⠀⠀⢀⢤⠗⠋⡝⠾⢛⡩⣭⠔⢧⣻⡿⣈⠱⢝⣿⣿⣟⡿⣿⣯⡴⢦⣼⣿⣷⣾⢯⣶⠛⠉⣴⡿⠓⠁⠀⢀⡴⠋⠀⣰⣟⠝⢀⠊⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠘⡸⡄⠙⣬⡓⣮⢷⠲⡤⣤⣀⣀⠀⠘⠛⠲⠤⢿⣮⡝⠨⢀⣤⠄⠑⢼⡿⠇⣀⠑⢿⢿⣞⡿⣿⣗⠂⠒⠈⢁⠔⡱⢁⢦⡿⠃⠀⠀⡀⠔⠉⠀⢀⡼⠛⠁⠀⠁⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠐⠿⡄⠈⢻⣼⣋⣓⡻⡵⣿⠇⠹⢱⣆⠀⠀⢸⡾⢦⣻⢮⣶⣯⠤⠤⠵⠸⣽⠃⠀⠙⢽⢾⣷⣿⡄⠀⢀⠋⢰⠱⣟⡻⠁⠀⠀⠀⠀⠀⡀⠔⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠈⠹⢄⠀⠛⣿⡜⡷⡿⠹⠀⠂⡿⣿⠀⠀⠸⡅⢈⠿⠛⣩⠤⢤⣀⣀⠀⠀⠀⠀⠀⠀⠑⢟⢿⣷⡀⡌⠀⢨⣿⠹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⢄⠘⢎⢺⡃⠁⢀⣾⣻⣽⠀⠀⡀⠳⠃⠀⡰⠁⠀⠀⠀⠀⠉⠉⠐⠒⠠⠤⢄⣀⡙⣽⣿⣅⠀⢸⣿⠀⢡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣇⣴⣿⣳⣯⣹⡄⠀⠀⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⡟⠻⣽⣳⣌⡇⠂⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⢧⣯⡿⠃⡇⠀⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣷⣻⣼⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⢯⣿⣿⢟⠀⠀⠣⠀⠀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣷⣻⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣻⣼⣿⠟⠈⠀⠀⢰⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣻⢿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣟⣳⡿⠃⠀⠀⠀⠀⠸⠴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣯⣟⡿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣽⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣽⣻⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣷⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⢸⡹⢿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠀⠀⠄⠀⠀⠀⠀⠀⠄⠀⠀⠀⢸⣿⣿⡷⠀⠀⠀⠀⠀⠀⠀ " 
	@echo " ⠀⠀⠀⠀⠀⠀⠀⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀ " 
	@echo "\033[0m"
endef


# ==================== Help Command ====================
help:
	@echo "\033[1;91m \033[1;92mM\033[1;93my\033[1;94mW\033[1;95me\033[1;96mb\033[1;91ms\033[1;92mi\033[1;93mt\033[1;94me\033[0m \033[1;95mDocker\033[0m \033[1;96mManagement\033[0m \033[1;91mCommands\033[0m "
	@echo "\033[1;5;93m══════════════════════════════════════════════════════════════════\033[0m"
	@echo ""
	@echo "\033[1;4;96m Development Environment:\033[0m"
	@echo "  \033[92mmake \033[36mdev\033[0m             \033[94m- Build development environment containers\033[0m"
	@echo "  \033[92mmake \033[36mdev-up\033[0m          \033[94m- Start development environment (detached)\033[0m"
	@echo "  \033[92mmake \033[36mdev-down\033[0m        \033[94m- Stop development environment containers\033[0m"
	@echo ""
	@echo "\033[1;4;91m Production Environment:\033[0m"
	@echo "  \033[92mmake \033[36mprod\033[0m            \033[94m- Build production environment containers\033[0m"
	@echo "  \033[92mmake \033[36mprod-up\033[0m         \033[94m- Start production environment (detached)\033[0m"
	@echo "  \033[92mmake \033[36mprod-down\033[0m       \033[94m- Stop production environment containers\033[0m"
	@echo ""
	@echo "\033[1;4;93m Logging & Monitoring:\033[0m"
	@echo "  \033[92mmake \033[36mdev-logs\033[0m         \033[94m- View all development logs (real-time)\033[0m"
	@echo "  \033[92mmake \033[36mdev-backend-logs\033[0m \033[94m- View backend service logs\033[0m"
	@echo "  \033[92mmake \033[36mdev-frontend-logs\033[0m\033[94m- View frontend logs\033[0m"
	@echo "  \033[92mmake \033[36mdev-nginx-logs\033[0m   \033[94m- View nginx logs\033[0m"
	@echo ""
	@echo "\033[1;4;95m Frontend Tools:\033[0m"
	@echo "  \033[92mmake \033[36mformat\033[0m          \033[94m- Format code with Prettier\033[0m"
	@echo "  \033[92mmake \033[36mcheck\033[0m           \033[94m- Check formatting with Prettier\033[0m"
	@echo "  \033[92mmake \033[36mscss\033[0m            \033[94m- Lint SCSS with Stylelint\033[0m"
	@echo "  \033[92mmake \033[36mscss-fix\033[0m        \033[94m- Fix SCSS linting issues\033[0m"
	@echo "  \033[92mmake \033[36mlint\033[0m            \033[94m- Lint TypeScript/React with ESLint\033[0m"
	@echo "  \033[92mmake \033[36mtypes\033[0m           \033[94m- Type check TypeScript\033[0m"
	@echo "  \033[92mmake \033[36mlint-full\033[0m       \033[94m- Run all linters\033[0m"
	@echo ""
	@echo "\033[1;4;95m Maintenance:\033[0m"
	@echo "  \033[92mmake \033[36mclean-docker\033[0m    \033[94m- Remove unused Docker images and containers\033[0m"
	@echo "  \033[92mmake \033[36mnuke-docker\033[0m     \033[94m- Prune all docker resources (images/volumes/cache)\033[0m"
	@echo ""
	$(call ASCII_DOCKER)


# ==================== Maintenance ====================
clean-docker:
	@echo "\033[1;3;4;96m======== Cleaning Docker Resources ========\033[0m"
	docker system prune -f
	docker image prune -f
	@echo "\033[1;92m Docker cleanup completed!\033[0m"
	$(call ASCII_DOCKER)

nuke-docker:
	@echo "\033[1;3;4;96m======== Prune images/volumes/cache ========\033[0m"
	docker system prune -a --volumes -f
	$(call ASCII_DOCKER)

# ==================== Development Environment ====================
dev:
	@echo "\033[1;3;4;96m======== Building Development Environment ========\033[0m"
	docker compose --env-file .env.dev -f $(DEV_COMPOSE_FILE) build
	$(call ASCII_BUILD)

dev-up:
	@echo "\033[1;3;4;96m======== Starting Development Environment ========\033[0m"
	docker compose --env-file .env.dev -f $(DEV_COMPOSE_FILE) up -d
	@echo "\033[1;92m Development environment started!\033[0m"
	@echo "\033[1;93m Frontend: http://localhost:3003\033[0m"
	@echo "\033[1;93m Backend API: http://localhost:8083/api\033[0m"
	@echo "\033[1;93m Backend Direct: http://localhost:5003\033[0m"
	@echo "\033[1;93m Redis: localhost:6382\033[0m"
	$(call ASCII_DOCKER)

dev-down:
	@echo "\033[1;3;4;96m======== Stopping Development Environment ========\033[0m"
	docker compose --env-file .env.dev -f $(DEV_COMPOSE_FILE) down
	$(call ASCII_DOCKER)


# ==================== Logging Commands ====================
dev-logs:
	@echo "\033[1;3;4;96m======== Viewing All Development Logs ========\033[0m"
	docker compose -f $(DEV_COMPOSE_FILE) logs -f
	$(call ASCII_LOGS)

dev-backend-logs:
	@echo "\033[1;3;4;96m======== Viewing Backend Service Logs ========\033[0m"
	docker compose -f $(DEV_COMPOSE_FILE) logs -f backend
	$(call ASCII_LOGS)

dev-frontend-logs:
	@echo "\033[1;3;4;96m======== Viewing Frontend Logs ========\033[0m"
	docker compose -f $(DEV_COMPOSE_FILE) logs -f frontend
	$(call ASCII_LOGS)

dev-nginx-logs:
	@echo "\033[1;3;4;96m======== Viewing Nginx Logs ========\033[0m"
	docker compose -f $(DEV_COMPOSE_FILE) logs -f nginx
	$(call ASCII_LOGS)

# ==================== Production Environment ====================
prod:
	@echo "\033[1;3;4;91m======== Building Production Environment ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) build
	$(call ASCII_BUILD)

prod-up:
	@echo "\033[1;3;4;91m======== Starting Production Environment ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) up -d
	@echo "\033[1;92m Production environment started!\033[0m"
	@echo "\033[1;91m Website: http://localhost:8083\033[0m"
	@echo "\033[1;91m Backend API: http://localhost:8083/api\033[0m"
	$(call ASCII_DOCKER)

prod-down:
	@echo "\033[1;3;4;91m======== Stopping Production Environment ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) down
	$(call ASCII_DOCKER)

prod-logs:
	@echo "\033[1;3;4;91m======== Viewing Production Logs ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) logs -f
	$(call ASCII_LOGS)

prod-backend-logs:
	@echo "\033[1;3;4;91m======== Viewing Production Backend Logs ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) logs -f backend
	$(call ASCII_LOGS)

prod-nginx-logs:
	@echo "\033[1;3;4;91m======== Viewing Production Nginx Logs ========\033[0m"
	docker compose -f $(PROD_COMPOSE_FILE) logs -f nginx
	$(call ASCII_LOGS)

# ==================== Frontend Formatting and Linting ====================
format:
	@echo "\033[1;3;4;96m======== Formatting with Prettier ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run format
	$(call ASCII_LINT)

check:
	@echo "\033[1;3;4;96m======== Checking formatting with Prettier ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run format:check
	$(call ASCII_LINT)

scss:
	@echo "\033[1;3;4;96m======== Linting SCSS with Stylelint ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run lint:scss
	$(call ASCII_LINT)

scss-fix:
	@echo "\033[1;3;4;96m======== Fixing SCSS with Stylelint ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run lint:scss:fix
	$(call ASCII_LINT)

lint:
	@echo "\033[1;3;4;96m======== Linting TypeScript/React with ESLint ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run lint:eslint
	$(call ASCII_LINT)

types:
	@echo "\033[1;3;4;96m======== Type checking TypeScript ========\033[0m"
	@cd $(FRONTEND_DIR) && npm run lint:types
	$(call ASCII_LINT)

lint-full: check scss lint types
	@echo "\033[1;92m✅ All linters passed!\033[0m"
	$(call ASCII_LINT)

			
