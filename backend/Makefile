# ©AngelaMos | 2025
# Carter Perez 

PYTHON := python

MAKEFLAGS += --no-print-directory

.PHONY: dev install reinstall check fix format mypy cve clean

.DEFAULT_GOAL := dev

define ASCII
	@echo "\033[35m"
	@echo " ⡋⣡⣴⣶⣶⡀⠄⠄⠙⢿⣿⣿⣿⣿⣿⣴⣿⣿⣿⢃⣤⣄⣀⣥⣿"
	@echo " ⢸⣇⠻⣿⣿⣿⣧⣀⢀⣠⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⣿⣿"
	@echo " ⢸⣿⣷⣤⣤⣤⣬⣙⣛⢿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡍⠄⠄⢀⣤⣄⠉"
	@echo " ⣖⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⢇⣿⣿⡷⠶⠶⢿⣿⣿⠇⢀"
	@echo " ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣷⣶⣥⣴"
	@echo " ⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿"
	@echo " ⣦⣌⣛⣻⣿⣿⣧⠙⠛⠛⡭⠅⠒⠦⠭⣭⡻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠄"
	@echo " ⣿⣿⣿⣿⣿⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠄⠹⠈⢋⣽⣿⣿⣿⣿⣵⣾"
	@echo " ⣿⣿⣿⣿⣿⣿⣿⣿⠄⣴⣿⣶⣄⠄⣴⣶⠄⢀⣾⣿⣿⣿⣿⣿⣿⠃⠄⠄"
	@echo " ⠈⠻⣿⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⠄⣿⣿⡀⣾⣿⣿⣿⣿⣛⠛⠁"
	@echo " ⠄⠄⠈⠛⢿⣿⣿⣿⠁⠞⢿⣿⣿⡄⢿⣿⡇⣸⣿⣿⠿⠛⠁⠄"
	@echo " ⠄⠄⠄⠄⠄⠉⠻⣿⣿⣾⣦⡙⠻⣷⣾⣿⠃⠿⠋⠁⠄"
	@echo "\033[0m"
endef


dev:
	@zsh -c "source .venv/bin/activate && exec zsh"
	$(call ASCII)

# ==================== Setup ====================
install:
	@echo "Installing development dependencies..."
	pip install -e ".[dev]"

reinstall:
	@echo "Reinstalling all dependencies (including upgrades)..."
	pip install -e ".[dev]" --upgrade --upgrade-strategy eager
	$(call ASCII)


# ==================== Syntax Checking (Ruff) ====================
check:
	@echo "\033[1;3;4;96m======== Checking All Code ========\033[0m"
	@ruff check .
	$(call ASCII)

	
# ==================== Syntax Checking (Ruff) ====================
fix:
	@echo "\033[1;3;4;96m======== ruff fix All Code ========\033[0m"
	@ruff check . --fix
	$(call ASCII)
	

# ======================== Yapf Format =============================
format:
	@echo "\033[1;3;4;96m======== Formatting only qa/ ========\033[0m"
	@yapf -i -r -vv api app
	$(call ASCII)

# ======================= Type Checking (mypy) =======================
mypy:
	@echo "\033[1;3;4;96m======== Type Checking All Code ========\033[0m"
	@mypy .
	$(call ASCII)
	
# ======================= Security deps (pip audit) =======================
cve:
	@echo "\033[1;3;4;96m======== Checking dep's for CVEs... ========\033[0m"
	@pip-audit -v
	$(call ASCII)

# ==================== Utilities ====================
clean:
	@echo "\033[1;3;4;96m======== Cleaning Cache Files ========\033[0m"
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete
	$(call ASCII)	
