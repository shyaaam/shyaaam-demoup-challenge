import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

/**
 * Controller to render Mermaid diagrams for the system.
 * This endpoint returns an HTML page that displays:
 *  - Entity Model Diagram
 *  - UML Sequence Diagram
 *  - Service Boundaries Diagram
 */
@Controller('diagrams')
export class DiagramController {
  /**
   * Returns an HTML page that renders multiple Mermaid diagrams.
   * @param res - Express response object.
   */
  @Get()
  getDiagrams(@Res() res: Response): void {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ER and Flowchart Diagrams</title>
        <!-- Load Mermaid.js from CDN -->
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ startOnLoad: true });
        </script>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .mermaid { margin-bottom: 40px; }
        </style>
      </head>
      <body>

        
        <h1>Service Boundaries Diagram</h1>
        <div class="mermaid">
          %%{init: {"flowchart": {"rankDir": "TB", "nodeSpacing": 50, "rankSpacing": 50, "curve": "linear"}}}%%
          flowchart LR
              %% Clients
              subgraph Clients
                  C["Client\nPros: Simple, Flexible\nCons: Requires polling for eventual consistency"]
              end

              %% Microservices
              subgraph Microservices
                  DS["Download Service\n(POST /download)\nPros: Decoupled, Quick response\nCons: Eventual consistency, Redis dependency"]
                  MS["Metadata Service\n(Async Processing)\nPros: Focused processing, Scalable\nCons: Processing latency, Error handling complexity"]
                  SS["Storage Service\n(Stores Image & Generates Public URL)\nPros: Separation of concerns, Scalability\nCons: Data consistency challenges, Resource intensive"]
                  GIS["Get Image Service\n(GET /image/:id)\nPros: Optimized reads, Clear interface\nCons: Cache invalidation challenges, Dependency on storage"]
              end

              %% Infrastructure Components
              subgraph Infrastructure
                  R["Redis\nPros: Fast, Decoupled, In-memory\nCons: Single point of failure, Potential event loss"]
                  PG["PostgreSQL\nPros: Reliable, Strong data integrity, Relational modeling\nCons: Scalability challenges, Complex migrations"]
              end

              %% Client interactions
              C -->|POST /download| DS
              C -->|GET /image/:id| GIS

              %% Service events and data flows
              DS -->|Publishes download_task_created event| R
              DS -->|Stores download task| PG

              R -->|Distributes event| MS
              MS -->|Processes metadata & stores record| PG
              MS -->|Publishes metadata_extracted event| R

              R -->|Distributes event| SS
              SS -->|Stores image & generates public URL| PG
              SS -->|Publishes public_image_generated event| R

              R -->|Delivers event| GIS
        </div>

        <h1>Entity Model Diagram</h1>
        <div class="mermaid">
          %%{init: {'er': {'layoutDirection': 'LR'}}}%%
          erDiagram
            DOWNLOAD_TASK {
              uuid id PK
              string originalUrl
              string status
              jsonb error_details
              datetime createdAt
            }
            IMAGE_METADATA {
              uuid id PK
              uuid downloadTaskId FK
              string format
              int width
              int height
              string status
              datetime createdAt
            }
            PUBLIC_IMAGE {
              uuid id PK
              uuid image_metadata_id FK "optional"
              string imagePath
              string publicUrl
              string status
              datetime createdAt
            }
            DOWNLOAD_TASK ||--o{ IMAGE_METADATA : "has"
            IMAGE_METADATA ||--|{ PUBLIC_IMAGE : "generates"
        </div>

        <h1>Domain Events Model</h1>
        <div class="mermaid">
        classDiagram
          class DownloadTaskCreated {
            +uuid taskId
            +string downloadUrl
            +datetime timestamp
            +string status
          }
          note for DownloadTaskCreated "Originating Service: Download Service<br/>Description: Fired when a client submits an image download request.<br/>Key Attributes: taskId, downloadUrl, timestamp, status.<br/>Pros: Immediate acknowledgment, triggers async processing.<br/>Cons: Client must poll or wait for further updates."

          class MetadataExtracted {
            +uuid taskId
            +string format
            +int width
            +int height
            +datetime extractionTime
            +string status
          }
          note for MetadataExtracted "Originating Service: Metadata Service<br/>Description: Emitted after successful extraction of image metadata.<br/>Key Attributes: taskId, format, width, height, extractionTime, status.<br/>Pros: Provides rich details for downstream processing.<br/>Cons: Increases processing overhead and complexity."

          class PublicImageGenerated {
            +uuid imageId
            +string imagePath
            +string publicUrl
            +datetime timestamp
            +uuid metadataId
          }
          note for PublicImageGenerated "Originating Service: Storage Service<br/>Description: Published when an image is stored and a public URL is generated.<br/>Key Attributes: imageId, imagePath, publicUrl, timestamp, metadataId.<br/>Pros: Provides a complete public image record for client access.<br/>Cons: Delays or inconsistencies may occur if processing is slow."

          class DownloadTaskFailed {
            +uuid taskId
            +string errorMessage
            +datetime timestamp
            +int errorCode
          }
          note for DownloadTaskFailed "Originating Service: Download/Metadata Service<br/>Description: Signals that an error occurred during processing.<br/>Key Attributes: taskId, errorMessage, timestamp, errorCode.<br/>Pros: Immediate error notification for corrective action.<br/>Cons: Requires robust error handling and compensation logic."

        </div>

        <h1>UML Sequence Diagram</h1>
        <div class="mermaid">
          sequenceDiagram
            participant Client
            participant DS as DownloadService
            participant MS as MetadataService
            participant SS as StorageService
            participant GS as GetImageService

            Client->>DS: POST /download {downloadUrl}
            note right of DS: Pros: Quick initiation,<br/>Decoupled process<br/>Cons: Asynchronous, eventual consistency

            DS-->>Client: {taskId, status:"pending"}
            note right of Client: Pros: Immediate acknowledgment<br/>Cons: Processing still pending

            DS->>MS: Publish download_task_created event
            note right of MS: Pros: Enables decoupling & scalability<br/>Cons: Depends on reliable event delivery

            alt Successful download
              MS->>MS: Extract metadata
              note right of MS: Pros: Local processing, independent scaling<br/>Cons: May introduce processing latency
              
              MS->>SS: Publish metadata_extracted event
              note right of SS: Pros: Automatically triggers storage phase<br/>Cons: Requires robust error handling
              
              SS->>SS: Store image and generate public URL
              note right of SS: Pros: Consolidated storage & URL generation<br/>Cons: Resource intensive process
              
              SS->>GS: Publish public_image_generated event
              note right of GS: Pros: Updates public image records<br/>Cons: May suffer propagation delay
            else Error occurs
              MS->>DS: Publish error event
              note right of DS: Pros: Informs system of failure<br/>Cons: Needs retry or compensation strategy
              
              DS-->>Client: {error:"Download failed"}
              note right of Client: Pros: Client informed of failure<br/>Cons: Error resolution not automatic
            end

            Client->>GS: GET /image/{id}
            note right of GS: Pros: Dedicated read service<br/>Cons: Data freshness depends on event propagation

            GS-->>Client: Returns image data or 404 error
            note right of Client: Pros: Final result delivered<br/>Cons: May return 404 if not processed

        </div>

        <h1>For read-optimized architecture</h1>
        <div class="mermaid">
          %%{init: {"flowchart": {"rankDir": "TB", "nodeSpacing": 50, "rankSpacing": 50}}}%%
            flowchart TD
                subgraph CRF [Client Request Flow]
                  A[Client Request]
                  B[Get Image Service]
                end

                subgraph IO [Infrastructure Optimizations]
                  C[Redis Cache]
                  D[Database Read Replicas]
                  E[CDN for Static Images]
                end

                subgraph EMA [Entity Modeling Adjustments]
                  F["Denormalized Read Model - CQRS"]
                  G[Materialized Views]
                  H["Optimized Table Structures & Indexes"]
                end

                A -->|HTTP GET /image/#123;id#125;| B
                B -->|Cache Lookup| C
                C -- Cache Hit --> B
                C -- Cache Miss --> D
                D --> B
                B -->|If Static| E

                D --> F
                F --> B
                D --> G
                G --> B
                D --> H
                H --> B

        </div>
        
      </body>
      </html>
    `;
    res.type('html').send(html);
  }
}
