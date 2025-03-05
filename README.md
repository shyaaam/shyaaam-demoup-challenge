# ScaleHoster

# Reasoning & Discussion for this project

## Service Boundaries

- **We separated concerns into four microservices.**  
  - **DownloadService:** Handles the customer request and initiates the asynchronous flow.  
  - **MetadataService:** Solely responsible for image analysis.  
  - **StorageService:** Focuses on persistence and public URL generation.  
  - **GetImageService:** Provides a read API.  
- **Benefit:** This separation promotes scalability and clear bounded contexts.

## Entity Modelling

- **Approach:**  
  Each service uses its own PostgreSQL schema to avoid a monolithic data model.  
- **Design:**  
  The entities are kept simple and service-specific. For example, the download task and image metadata are managed separately, reducing coupling.

## Domain Events

- **Usage:**  
  Used Redis events (e.g., `download_task_created`, `metadata_extracted`, `public_image_generated`) to decouple the asynchronous processing stages.  
- **Benefit:**  
  This design supports fault tolerance and horizontal scaling.

## Rejected Solutions

- **Monolithic NestJS Application:**  
  Avoided a single monolithic application with one database schema because it would hinder scalability and violate microservices principles.
- **Synchronous Processing:**  
  Synchronous processing was rejected to ensure customers can continue without waiting for image processing.

## Scope for Improvement: Client Notification Strategies

- **Client Notification:**  
  Currently, the client receives a task ID and must later obtain the public image details.  
- **Potential Strategies:**  
  - **Polling:**  
    Clients periodically query a status endpoint (e.g., `GET /download-status/:taskId`) to retrieve the public image ID and URL once processing is complete.
  - **Callbacks/Webhooks:**  
    Clients can provide a callback URL during the request. Once processing completes, the system sends the public image details to this URL.
  - **WebSockets/Event Streaming:**  
    Clients subscribe to real-time events (using WebSockets) to be notified immediately when the public image is ready.
- **Benefit:**  
  Implementing these strategies would improve user experience by providing timely updates on processing status.
- **Consideration:**  
  These strategies are not part of the core architecture but represent valuable enhancements for future iterations.

## Read Optimized Model

- **Plan for High-Read Performance:**  
  For high-read performance, the GetImageService can later introduce caching (e.g., Redis), denormalized read models or even serving the public image URL via CDN.
- **Layered Approach:**  
  This infrastructure-based optimization would be layered over the entity modeling adjustments.