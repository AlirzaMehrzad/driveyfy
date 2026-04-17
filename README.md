# 🚀 AI-Powered E-Commerce API

A high-performance, asynchronous NestJS backend that automatically generates AI-driven product descriptions using completely free, locally hosted Large Language Models (LLMs).

## ✨ Features

* **⚡ Lightning Fast API:** Returns instant responses to the client by offloading heavy AI generation to background workers.
* **🧠 Local AI Integration:** Uses [Ollama](https://ollama.com/) to run models like Llama 3 locally. 100% free, zero API costs, and total data privacy.
* ** Queue Management:** Robust background job processing using **BullMQ** and Redis. Includes auto-retries and concurrency control.
* **📊 Visual Dashboard:** Built-in **Bull Board** UI to monitor queues, active jobs, and AI generation times in real-time.
* ```bash
  http://localhost:3000/admin/queues/
* **📦 Database:** Fully integrated with **MongoDB** (via Mongoose) to seamlessly update documents once the AI finishes processing.

---

## 🛠️ Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Database:** MongoDB + Mongoose
* **Queue/Background Jobs:** BullMQ + Redis
* **AI Provider:** Ollama (Llama 3 / Mistral / Gemma)
* **Monitoring:** @bull-board/nestjs

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed on your machine:
1. **Node.js** (v18 or higher)
2. **MongoDB** (Running locally or via MongoDB Atlas)
3. **Redis** (Running locally on port 6379, or via Docker)
4. **Ollama** (Download from [ollama.com](https://ollama.com/))

**Pull your preferred AI model via terminal:**
```bash
ollama run llama3
```bash
ollama run deepseek-r1

