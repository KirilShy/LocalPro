FROM python:3.12-slim

# Prevents Python from writing .pyc files and buffers stdout —
# both make container logs behave properly instead of getting lost in buffers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements FIRST, before the rest of the code.
# Docker caches each layer — if requirements/*.txt hasn't changed,
# this layer is reused and `pip install` is skipped entirely on rebuilds.
# If we copied all the code first, ANY code change would invalidate
# this layer and force a full pip reinstall every time.
COPY requirements/ requirements/
RUN pip install --no-cache-dir -r requirements/production.txt

# Now copy the rest of the app
COPY . .

# collectstatic just needs settings.py to import successfully — it never
# touches the database. These are throwaway values so the build doesn't
# depend on real secrets; the actual SECRET_KEY/DB_* come from the
# container's runtime environment (ECS task def, docker run -e, etc.)
# and override these at startup.
ENV SECRET_KEY=build-time-placeholder
ENV DB_NAME=build
ENV DB_USER=build
ENV DB_PASSWORD=build
ENV DB_HOST=build
ENV DB_PORT=5432
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
