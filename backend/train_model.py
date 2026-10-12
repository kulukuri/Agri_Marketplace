import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import os

# 1. Setup Parameters
DATASET_DIR = "dataset"
IMG_SIZE = (224, 224) # MobileNetV2 standard size
BATCH_SIZE = 16

print("Loading dataset...")
# 2. Load the dataset (automatically handles the 5 folders)
train_dataset = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    shuffle=True,
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    validation_split=0.2,
    subset="training",
    seed=123
)

val_dataset = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    shuffle=True,
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    validation_split=0.2,
    subset="validation",
    seed=123
)

class_names = train_dataset.class_names
print(f"Found classes: {class_names}")

# 3. Build the MobileNetV2 Transfer Learning Model
print("Building model...")
# Load pre-trained MobileNetV2 without the final output layer
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # Freeze the base model to train fast on CPU

# Add our own classification layers for the 5 tomato classes
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(len(class_names), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# 4. Compile and Train
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

print("Starting training (this will be fast)...")
# Training for just 5 epochs is enough to show progress
history = model.fit(train_dataset, validation_data=val_dataset, epochs=5)

# 5. Save the model for FastAPI
model.save("tomato_quality_model.h5")
print("Model saved successfully as 'tomato_quality_model.h5'!")